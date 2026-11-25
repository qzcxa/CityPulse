const express = require("express");
const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(__dirname, "data");
const PHOTO_DIR = path.join(DATA_DIR, "photos");
fs.mkdirSync(PHOTO_DIR, { recursive: true });

const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || "";
if (!ADMIN_KEY) {
  console.warn("⚠ ADMIN_KEY не задано: режим адміністратора буде вимкнено.");
}

const CATS = ["road", "light", "trash", "walk", "pub", "other"];
const STATUSES = ["new", "work", "done"];
const PRIORITIES = ["high", "mid", "low"];
const PHOTO_RE = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/;

// ----- база даних (один файл, вбудована в Node.js) -----
const db = new DatabaseSync(path.join(DATA_DIR, "citypulse.db"));
db.exec("PRAGMA journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    addr        TEXT NOT NULL DEFAULT '',
    cat         TEXT NOT NULL,
    st          TEXT NOT NULL DEFAULT 'new',
    pr          TEXT NOT NULL DEFAULT 'mid',
    lat         REAL NOT NULL,
    lng         REAL NOT NULL,
    t           INTEGER NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    photo       TEXT NOT NULL DEFAULT ''
  )
`);

const insertStmt = db.prepare(`
  INSERT INTO reports (id, title, addr, cat, st, pr, lat, lng, t, description, photo)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const listStmt = db.prepare("SELECT * FROM reports ORDER BY t DESC LIMIT 1000");
const statusStmt = db.prepare("UPDATE reports SET st = ? WHERE id = ?");

// переводимо рядок БД у формат, який очікує app.js
const toDTO = (r) => ({
  id: r.id,
  title: r.title,
  addr: r.addr,
  cat: r.cat,
  st: r.st,
  pr: r.pr,
  lat: r.lat,
  lng: r.lng,
  t: r.t,
  desc: r.description,
  hasPhoto: !!r.photo,
  photo: r.photo ? "/photos/" + r.photo : "",
});

const isAdmin = (req) => !!ADMIN_KEY && req.get("x-admin-key") === ADMIN_KEY;
const inObl = (lat, lng) =>
  lat >= 47.72 && lat <= 48.68 && lng >= 24.9 && lng <= 27.54;
const clean = (v, max) =>
  String(v ?? "")
    .trim()
    .slice(0, max);

// захист від спаму: не більше 10 повідомлень з однієї IP за 10 хвилин
const hits = new Map();
const tooMany = (ip) => {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60e3);
  const blocked = arr.length >= 10;
  if (!blocked) arr.push(now);
  hits.set(ip, arr);
  return blocked;
};

const app = express();
app.use(express.json({ limit: "3mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-key");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ----- API -----
app.get("/api/admin/check", (req, res) => {
  res.sendStatus(isAdmin(req) ? 204 : 401);
});

app.get("/api/reports", (req, res) => {
  res.json(listStmt.all().map(toDTO));
});

app.post("/api/reports", (req, res) => {
  if (tooMany(req.ip)) {
    return res
      .status(429)
      .json({ error: "Забагато повідомлень. Спробуйте трохи пізніше." });
  }
  const b = req.body || {};
  const title = clean(b.title, 80);
  const lat = Number(b.lat);
  const lng = Number(b.lng);

  if (!title) return res.status(400).json({ error: "Вкажіть, що сталося." });
  if (!CATS.includes(b.cat))
    return res.status(400).json({ error: "Невірна категорія." });
  if (!PRIORITIES.includes(b.pr))
    return res.status(400).json({ error: "Невірний пріоритет." });
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !inObl(lat, lng)) {
    return res
      .status(400)
      .json({ error: "Місце має бути в межах Чернівецької області." });
  }

  const id = crypto.randomUUID();
  let photo = "";
  if (b.photo) {
    const m = PHOTO_RE.exec(b.photo);
    if (!m) {
      return res
        .status(400)
        .json({ error: "Фото має бути у форматі JPEG, PNG або WebP." });
    }
    photo = `${id}.${m[1] === "jpeg" ? "jpg" : m[1]}`;
    fs.writeFileSync(path.join(PHOTO_DIR, photo), Buffer.from(m[2], "base64"));
  }

  const rec = {
    id,
    title,
    addr: clean(b.addr, 100),
    cat: b.cat,
    st: "new",
    pr: b.pr,
    lat,
    lng,
    t: Date.now(),
    description: clean(b.desc, 1000),
    photo,
  };
  insertStmt.run(
    rec.id,
    rec.title,
    rec.addr,
    rec.cat,
    rec.st,
    rec.pr,
    rec.lat,
    rec.lng,
    rec.t,
    rec.description,
    rec.photo,
  );
  res.status(201).json(toDTO(rec));
});

app.patch("/api/reports/:id/status", (req, res) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: "Потрібен ключ адміністратора." });
  }
  const st = req.body?.st;
  if (!STATUSES.includes(st)) {
    return res.status(400).json({ error: "Невірний статус." });
  }
  const info = statusStmt.run(st, req.params.id);
  if (!info.changes) return res.status(404).json({ error: "Не знайдено." });
  res.json({ ok: true });
});

// ----- сайт і фото -----
// віддаємо лише потрібні файли (щоб не відкрити код і базу даних)
app.get("/", (req, res) => res.sendFile(path.join(ROOT, "index.html")));
["index.html", "style.css", "app.js", "hero.jpg"].forEach((f) =>
  app.get("/" + f, (req, res) => res.sendFile(path.join(ROOT, f))),
);
app.use("/photos", express.static(PHOTO_DIR));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (req.path.startsWith("/api/")) {
    const msg =
      err.type === "entity.too.large"
        ? "Фото занадто велике."
        : "Помилка сервера.";
    return res.status(status).json({ error: msg });
  }
  res.status(status).send("Помилка сервера");
});

app.listen(PORT, () => {
  console.log(`CityPulse працює: http://localhost:${PORT}`);
});
