require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const CATS = ["road", "light", "trash", "walk", "pub", "other"];
const PRS = ["high", "mid", "low"];
const STS = ["new", "work", "done"];
const ADMIN = process.env.ADMIN_KEY || "";

/* ---------- сховище: PostgreSQL або файл ---------- */
async function makeStore() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { Pool } = require("pg");
    const local = /localhost|127\.0\.0\.1/.test(url);
    const pool = new Pool({
      connectionString: url,
      ssl: local ? false : { rejectUnauthorized: false },
    });
    await pool.query(`create table if not exists reports(
      id text primary key, title text not null, addr text not null default '',
      cat text not null, st text not null default 'new', pr text not null,
      lat double precision not null, lng double precision not null,
      t bigint not null, descr text not null default '')`);
    await pool.query(
      "alter table reports add column if not exists photo bytea",
    );
    console.log("Сховище: PostgreSQL");
    return {
      list: async () =>
        (
          await pool.query(
            `select id,title,addr,cat,st,pr,lat,lng,t::float8 as t,descr as "desc",(photo is not null) as "hasPhoto" from reports order by t desc`,
          )
        ).rows,
      add: (r, photo) =>
        pool.query(
          "insert into reports(id,title,addr,cat,st,pr,lat,lng,t,descr,photo) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
          [
            r.id,
            r.title,
            r.addr,
            r.cat,
            r.st,
            r.pr,
            r.lat,
            r.lng,
            r.t,
            r.desc,
            photo || null,
          ],
        ),
      getPhoto: async (id) => {
        const q = await pool.query("select photo from reports where id=$1", [
          id,
        ]);
        return q.rows[0] ? q.rows[0].photo : null;
      },
      setSt: async (id, st) =>
        (await pool.query("update reports set st=$2 where id=$1", [id, st]))
          .rowCount,
      count: async () =>
        +(await pool.query("select count(*) from reports")).rows[0].count,
    };
  }
  const file = path.join(__dirname, "data", "reports.json");
  let arr = [];
  try {
    arr = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {}
  const flush = () => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
  };
  console.log("Сховище: файл server/data/reports.json (лише для розробки)");
  return {
    list: async () => [...arr].sort((a, b) => b.t - a.t),
    add: async (r, photo) => {
      r.hasPhoto = !!photo;
      if (photo) {
        fs.mkdirSync(path.join(path.dirname(file), "photos"), {
          recursive: true,
        });
        fs.writeFileSync(
          path.join(path.dirname(file), "photos", r.id + ".jpg"),
          photo,
        );
      }
      arr.push(r);
      flush();
    },
    getPhoto: async (id) => {
      try {
        return fs.readFileSync(
          path.join(path.dirname(file), "photos", id + ".jpg"),
        );
      } catch (e) {
        return null;
      }
    },
    setSt: async (id, st) => {
      const r = arr.find((x) => x.id === id);
      if (!r) return 0;
      r.st = st;
      flush();
      return 1;
    },
    count: async () => arr.length,
  };
}

/* ---------- допоміжне ---------- */
const str = (v, n) =>
  String(v == null ? "" : v)
    .trim()
    .slice(0, n);
function validate(b) {
  const title = str(b.title, 80);
  const lat = Number(b.lat),
    lng = Number(b.lng);
  if (!title) return { error: "Вкажіть, що сталося." };
  if (
    !(Math.abs(lat) <= 90 && Math.abs(lng) <= 180) ||
    b.lat === "" ||
    b.lng === ""
  )
    return { error: "Некоректні координати." };
  if (!CATS.includes(b.cat) || !PRS.includes(b.pr))
    return { error: "Некоректна категорія або пріоритет." };
  let photo = null;
  if (b.photo) {
    const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(
      String(b.photo),
    );
    if (!m) return { error: "Фото має бути у форматі JPEG." };
    photo = Buffer.from(m[1], "base64");
    if (photo.length > 600 * 1024) return { error: "Фото завелике." };
    if (!(photo[0] === 0xff && photo[1] === 0xd8 && photo[2] === 0xff))
      return { error: "Некоректне фото." };
  }
  return {
    photo,
    report: {
      id: crypto.randomUUID(),
      title,
      addr: str(b.addr, 100),
      cat: b.cat,
      pr: b.pr,
      desc: str(b.desc, 500),
      st: "new",
      lat,
      lng,
      t: Date.now(),
    },
  };
}
const isAdmin = (req) => {
  const k = Buffer.from(req.get("x-admin-key") || "");
  const a = Buffer.from(ADMIN);
  return ADMIN !== "" && k.length === a.length && crypto.timingSafeEqual(k, a);
};
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 3600e3);
  const over = arr.length >= 10; // 10 повідомлень на годину з однієї адреси
  if (!over) arr.push(now);
  hits.set(ip, arr);
  return over;
}

const DEMO = [
  [
    "Яма на проїжджій частині",
    "вул. Хрещатик, 22",
    "road",
    "new",
    "high",
    50.4474,
    30.5226,
    0.3,
  ],
  [
    "Не працює ліхтар",
    "вул. Саксаганського, 41",
    "light",
    "work",
    "mid",
    50.4387,
    30.508,
    1,
  ],
  [
    "Переповнений контейнер",
    "вул. Лук’янівська, 15",
    "trash",
    "new",
    "mid",
    50.456,
    30.504,
    2,
  ],
  [
    "Зруйнований тротуар",
    "просп. Перемоги, 30",
    "walk",
    "work",
    "high",
    50.454,
    30.462,
    3,
  ],
  [
    "Зламана лавка в парку",
    "Маріїнський парк",
    "pub",
    "done",
    "low",
    50.443,
    30.537,
    9,
  ],
  [
    "Провалля біля люка",
    "вул. Січових Стрільців, 8",
    "road",
    "work",
    "high",
    50.4565,
    30.496,
    14,
  ],
  [
    "Не світиться пішохідний перехід",
    "бульв. Лесі Українки, 20",
    "light",
    "new",
    "high",
    50.431,
    30.537,
    35,
  ],
  [
    "Стихійне сміттєзвалище",
    "вул. Набережно-Рибальська, 3",
    "trash",
    "done",
    "mid",
    50.465,
    30.525,
    62,
  ],
  [
    "Розбитий бордюр",
    "вул. Антоновича, 70",
    "road",
    "done",
    "low",
    50.422,
    30.516,
    95,
  ],
  [
    "Небезпечне дерево біля дороги",
    "вул. Володимирська, 50",
    "other",
    "new",
    "mid",
    50.444,
    30.513,
    130,
  ],
];

(async () => {
  const store = await makeStore();
  if (process.env.SEED_DEMO === "1" && (await store.count()) === 0) {
    for (const a of DEMO)
      await store.add({
        id: crypto.randomUUID(),
        title: a[0],
        addr: a[1],
        cat: a[2],
        st: a[3],
        pr: a[4],
        lat: a[5],
        lng: a[6],
        t: Date.now() - a[7] * 864e5,
        desc: "",
      });
    console.log("Додано демонстраційні повідомлення");
  }

  const app = express();
  app.set("trust proxy", 1);
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/reports", async (req, res, next) => {
    try {
      res.json(await store.list());
    } catch (e) {
      next(e);
    }
  });
  app.post("/api/reports", async (req, res, next) => {
    try {
      if (limited(req.ip))
        return res
          .status(429)
          .json({ error: "Забагато повідомлень. Спробуйте за годину." });
      const v = validate(req.body || {});
      if (v.error) return res.status(400).json({ error: v.error });
      await store.add(v.report, v.photo);
      v.report.hasPhoto = !!v.photo;
      res.status(201).json(v.report);
    } catch (e) {
      next(e);
    }
  });
  app.get("/api/reports/:id/photo", async (req, res, next) => {
    try {
      if (!/^[0-9a-f-]{36}$/.test(req.params.id)) return res.sendStatus(404);
      const buf = await store.getPhoto(req.params.id);
      if (!buf) return res.sendStatus(404);
      res.set({
        "Content-Type": "image/jpeg",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=86400",
      });
      res.send(buf);
    } catch (e) {
      next(e);
    }
  });
  app.get("/api/admin/check", (req, res) =>
    res.sendStatus(isAdmin(req) ? 204 : 401),
  );
  app.patch("/api/reports/:id/status", async (req, res, next) => {
    try {
      if (!isAdmin(req))
        return res.status(401).json({ error: "Потрібен ключ адміністратора." });
      const st = req.body && req.body.st;
      if (!STS.includes(st))
        return res.status(400).json({ error: "Некоректний статус." });
      const n = await store.setSt(req.params.id, st);
      if (!n)
        return res.status(404).json({ error: "Повідомлення не знайдено." });
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  app.use(express.static(path.join(__dirname, "..", "client")));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Помилка сервера." });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`CityPulse: http://localhost:${port}`));
})();
