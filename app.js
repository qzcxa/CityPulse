/* ===== ДЕМО-РЕЖИМ: сервер не потрібен =====
   Усі дані живуть у браузері (localStorage). Кнопки, форми, карта, фільтри,
   зміна статусів (ключ адміна: demo) працюють як на справжньому сайті. */
(() => {
  const KEY = "cp-demo-v3";
  const ADMIN = "demo";
  const DAY = 864e5;
  const scene = (k) => {
    const S = {
      pit: `<defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#77767f"/><stop offset="1" stop-color="#3b3a45"/></linearGradient><radialGradient id="h"><stop offset="0" stop-color="#121118"/><stop offset="1" stop-color="#2d2c35"/></radialGradient></defs><rect width="640" height="420" fill="url(#a)"/><path d="M0 70H640M0 350H640" stroke="#a09fa9" stroke-width="5" stroke-dasharray="46 34" opacity=".45"/><ellipse cx="330" cy="236" rx="175" ry="84" fill="#8b8a94"/><ellipse cx="330" cy="242" rx="145" ry="64" fill="url(#h)"/><path d="M160 196 70 150M500 206 610 168M300 322 276 410M420 316 480 402M200 270 90 300" stroke="#25242c" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      lamp: `<defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1030"/><stop offset="1" stop-color="#232a5e"/></linearGradient><radialGradient id="g"><stop offset="0" stop-color="#ffd98a" stop-opacity=".95"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs><rect width="640" height="420" fill="url(#a)"/><circle cx="200" cy="120" r="160" fill="url(#g)"/><rect y="330" width="640" height="90" fill="#15162e"/><rect x="164" y="118" width="12" height="230" fill="#0a0b1c"/><path d="M164 112H212" stroke="#0a0b1c" stroke-width="10" stroke-linecap="round"/><circle cx="212" cy="112" r="14" fill="#ffe7a8"/><g fill="#ffd98a" opacity=".7"><circle cx="420" cy="170" r="5"/><circle cx="520" cy="160" r="4"/><circle cx="580" cy="150" r="3"/><circle cx="350" cy="190" r="6"/></g><path d="M0 340Q320 310 640 345" stroke="#2c3270" stroke-width="3" fill="none"/>`,
      bins: `<defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f5d3a"/><stop offset="1" stop-color="#18331f"/></linearGradient></defs><rect width="640" height="420" fill="url(#a)"/><circle cx="90" cy="90" r="120" fill="#27522f"/><circle cx="560" cy="70" r="130" fill="#356b40"/><rect y="330" width="640" height="90" fill="#4a4a52"/><rect x="140" y="170" width="130" height="170" rx="8" fill="#1f5fa8"/><rect x="130" y="156" width="150" height="24" rx="6" fill="#174a85"/><rect x="300" y="170" width="130" height="170" rx="8" fill="#2a6fbd"/><rect x="290" y="156" width="150" height="24" rx="6" fill="#1b5593"/><rect x="460" y="190" width="110" height="150" rx="8" fill="#8a8f96"/><rect x="452" y="176" width="126" height="22" rx="6" fill="#6c7178"/><g fill="#c9c2b4"><circle cx="110" cy="345" r="16"/><circle cx="150" cy="360" r="12"/><circle cx="440" cy="352" r="14"/><circle cx="560" cy="358" r="18"/><circle cx="330" cy="365" r="10"/></g><g fill="#9b6b43"><circle cx="190" cy="352" r="11"/><circle cx="500" cy="362" r="9"/></g>`,
    };
    return (
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">${S[k]}</svg>`,
      )
    );
  };
  // Демо-дані лише з Чернівецької області
  const seed = () => {
    const n = Date.now();
    const A = (i, title, addr, cat, st, pr, lat, lng, ago, desc, photo) => ({
      id: "demo" + i,
      title,
      addr,
      cat,
      st,
      pr,
      lat,
      lng,
      t: n - ago * DAY,
      desc: desc || "",
      hasPhoto: !!photo,
      photo: photo || "",
    });
    return [
      A(
        1,
        "Яма на дорозі",
        "вул. Головна, 45, Чернівці",
        "road",
        "new",
        "high",
        48.2897,
        25.9372,
        0.08,
        "Глибока яма на смузі руху, водії об'їжджають її по зустрічній.",
        scene("pit"),
      ),
      A(
        2,
        "Не працює ліхтар",
        "вул. Університетська, 28, Чернівці",
        "light",
        "work",
        "mid",
        48.2931,
        25.9291,
        0.13,
        "Вечорами у дворі повністю темно.",
        scene("lamp"),
      ),
      A(
        3,
        "Переповнені контейнери",
        "вул. Руська, 12, Чернівці",
        "trash",
        "new",
        "mid",
        48.2918,
        25.9462,
        0.21,
        "Сміття не вивозили кілька днів.",
        scene("bins"),
      ),
      A(
        4,
        "Зруйнований тротуар",
        "вул. Героїв Майдану, 30, Чернівці",
        "walk",
        "work",
        "high",
        48.2884,
        25.9331,
        3,
        "Плитка провалилась, складно пройти з візком.",
      ),
      A(
        5,
        "Зламана лавка в парку",
        "парк Жовтневий, Чернівці",
        "pub",
        "done",
        "low",
        48.2876,
        25.9501,
        9,
      ),
      A(
        6,
        "Провалля біля люка",
        "вул. Хотинська, 8, Чернівці",
        "road",
        "work",
        "high",
        48.3068,
        25.924,
        14,
        "Асфальт просів навколо каналізаційного люка.",
      ),
      A(
        7,
        "Не світиться пішохідний перехід",
        "просп. Незалежності, 20, Чернівці",
        "light",
        "new",
        "high",
        48.2866,
        25.918,
        35,
      ),
      A(
        8,
        "Стихійне сміттєзвалище",
        "вул. Комарова, 3, Чернівці",
        "trash",
        "done",
        "mid",
        48.3105,
        25.966,
        62,
      ),
      A(
        9,
        "Розбитий бордюр",
        "вул. Ольги Кобилянської, 30, Чернівці",
        "road",
        "done",
        "low",
        48.2899,
        25.9336,
        95,
      ),
      A(
        10,
        "Небезпечне дерево біля дороги",
        "вул. Університетська, 50, Чернівці",
        "other",
        "new",
        "mid",
        48.2975,
        25.9265,
        130,
        "Суха гілка нависає над тротуаром.",
      ),
      A(
        11,
        "Яма біля центрального ринку",
        "центр, м. Хотин",
        "road",
        "new",
        "high",
        48.5115,
        26.4935,
        1,
        "Яма пошкоджує колеса авто.",
      ),
      A(
        12,
        "Не горить ліхтар біля парку",
        "центр, м. Кіцмань",
        "light",
        "work",
        "mid",
        48.4545,
        25.784,
        4,
      ),
      A(
        13,
        "Переповнені смітники",
        "центр, м. Сторожинець",
        "trash",
        "new",
        "mid",
        48.1645,
        25.712,
        6,
      ),
      A(
        14,
        "Зламана лавка на набережній",
        "набережна Черемошу, м. Вижниця",
        "pub",
        "done",
        "low",
        48.247,
        25.188,
        20,
      ),
      A(
        15,
        "Пошкоджений тротуар біля школи",
        "смт Глибока",
        "walk",
        "new",
        "high",
        48.0833,
        25.934,
        2,
        "Діти змушені йти по проїжджій частині.",
      ),
    ];
  };
  const read = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));
      if (Array.isArray(v)) return v;
    } catch (e) {}
    const s = seed();
    write(s);
    return s;
  };
  const write = (v) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(v));
      return true;
    } catch (e) {
      return false;
    }
  };
  const reply = (data, status = 200) =>
    Promise.resolve(
      new Response(data == null ? null : JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    );
  const realFetch = window.fetch.bind(window);
  window.fetch = (url, opt = {}) => {
    const u = String(url);
    if (!u.includes("/api/")) return realFetch(url, opt);
    const adm = (opt.headers || {})["x-admin-key"] === ADMIN;
    const method = (opt.method || "GET").toUpperCase();
    if (u.endsWith("/api/admin/check")) return reply(null, adm ? 204 : 401);
    if (u.endsWith("/api/reports") && method === "GET") return reply(read());
    if (u.endsWith("/api/reports") && method === "POST") {
      const b = JSON.parse(opt.body || "{}");
      if (!b.title) return reply({ error: "Вкажіть, що сталося." }, 400);
      const rec = {
        id: "u" + Date.now(),
        title: b.title,
        addr: b.addr || "",
        cat: b.cat,
        pr: b.pr,
        st: "new",
        lat: b.lat,
        lng: b.lng,
        t: Date.now(),
        desc: b.desc || "",
        hasPhoto: !!b.photo,
        photo: b.photo || "",
      };
      const list = read();
      list.unshift(rec);
      if (!write(list) && rec.photo) {
        rec.photo = "";
        rec.hasPhoto = false;
        write(list);
      }
      return reply(rec, 201);
    }
    const m = u.match(/\/api\/reports\/([^/]+)\/status$/);
    if (m && method === "PATCH") {
      if (!adm) return reply({ error: "Потрібен ключ адміністратора." }, 401);
      const st = JSON.parse(opt.body || "{}").st;
      const list = read();
      const r = list.find((x) => x.id === m[1]);
      if (!r) return reply({ error: "Не знайдено." }, 404);
      r.st = st;
      write(list);
      return reply({ ok: true });
    }
    return reply({ error: "Не підтримується в демо." }, 404);
  };
  window.addEventListener("DOMContentLoaded", () => {
    const f = document.querySelector(".foot");
    if (f)
      f.insertAdjacentHTML(
        "beforeend",
        "<br><small>Демо-режим · ключ адміна: <b>demo</b></small>",
      );
  });
})();

const CATS = {
  road: ["Дороги", "🕳️", "#ef4444"],
  light: ["Освітлення", "💡", "#8b7df5"],
  trash: ["Сміття", "🗑️", "#34b06b"],
  walk: ["Тротуари", "🚶", "#f59e0b"],
  pub: ["Громадські місця", "🌳", "#22b8a5"],
  other: ["Інше", "❓", "#7f8db0"],
};
const ST = {
  new: ["Нове", "#ff6b6b"],
  work: ["У роботі", "#f5a524"],
  done: ["Вирішено", "#4ade80"],
};
const PR = { high: "Високий", mid: "Середній", low: "Низький" };
const SV = (p, col = "#fff") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICO = {
  road: SV('<path d="M12 3 2.5 20h19L12 3z"/><path d="M12 10v4M12 17.2v.1"/>'),
  light: SV(
    '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  ),
  trash: SV('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  walk: SV(
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  ),
  pub: SV(
    '<path d="M12 21v-6"/><path d="M12 3C8.7 3 6 5.5 6 8.6c0 1 .3 1.9.8 2.7A4 4 0 0 0 8 19h8a4 4 0 0 0 1.2-7.7c.5-.8.8-1.7.8-2.7C18 5.5 15.3 3 12 3z"/>',
  ),
  other: SV(
    '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5M12 17v.1"/>',
  ),
};
const PIN = SV(
  '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  "currentColor",
);
const CLK = SV(
  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  "currentColor",
);
const D = 864e5,
  now = Date.now(),
  $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[m],
  );
let R = [],
  lastJSON = "";
// Якщо сторінку відкрито через Live Server (порт 5500), звертаємось до сервера на 3000
const API = location.port === "5500" ? "http://localhost:3000" : "";
let adminKey = "";
try {
  adminKey = sessionStorage.getItem("cp-admin") || "";
} catch (e) {}
const api = (path, opt = {}) =>
  fetch(API + path, {
    ...opt,
    headers: {
      "Content-Type": "application/json",
      ...(adminKey ? { "x-admin-key": adminKey } : {}),
    },
  });
const sync = (t) => {
  $("syncTxt").textContent = t;
};
async function load() {
  try {
    const r = await api("/api/reports");
    if (!r.ok) throw 0;
    const data = await r.json(),
      j = JSON.stringify(data);
    if (j !== lastJSON) {
      lastJSON = j;
      R = data;
      render();
    }
    sync(
      "Демо-режим: дані зберігаються у вашому браузері. Оновлено " +
        new Date().toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    );
  } catch (e) {
    sync("Немає зв’язку із сервером. Запустіть його командою npm start.");
  }
}
const F = { st: "all", q: "", pr: "", cat: "all" };
const age = (t) => {
  const d = (Date.now() - t) / D;
  return d < 1 ? "сьогодні" : Math.floor(d) + " дн.";
};
const dt = (t) =>
  new Date(t).toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
const pill = (s) =>
  `<span class="pill" style="--c:${ST[s][1]}">${ST[s][0]}</span>`;
const photoH = (r) =>
  r.hasPhoto
    ? `<img class="ph" loading="lazy" alt="Фото проблеми" src="${esc(r.photo || "")}">`
    : "";
const prc = (p) =>
  `<span class="${p === "high" ? "high" : ""}">${PR[p]}</span>`;
const stSel = (r) =>
  !adminKey
    ? pill(r.st)
    : `<select aria-label="Статус" onchange="setSt('${r.id}',this.value)" onclick="event.stopPropagation()">${Object.keys(
        ST,
      )
        .map(
          (k) =>
            `<option value="${k}" ${k === r.st ? "selected" : ""}>${ST[k][0]}</option>`,
        )
        .join("")}</select>`;
window.setSt = async (id, v) => {
  try {
    const r = await api(`/api/reports/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ st: v }),
    });
    if (r.status === 401) {
      adminKey = "";
      try {
        sessionStorage.removeItem("cp-admin");
      } catch (e) {}
      alert("Ключ адміністратора недійсний.");
      updAdm();
    } else if (!r.ok) throw 0;
  } catch (e) {
    alert("Не вдалося змінити статус.");
  }
  lastJSON = "";
  load();
};

/* карта */
/* карта: показуємо лише Чернівецьку область */
const OBL = [
  [48.6735, 25.6305],
  [48.6659, 25.6613],
  [48.6626, 25.7148],
  [48.6548, 25.7231],
  [48.6376, 25.7303],
  [48.637, 25.7478],
  [48.6631, 25.7601],
  [48.6753, 25.7758],
  [48.6754, 25.7873],
  [48.668, 25.8066],
  [48.6294, 25.844],
  [48.6226, 25.8576],
  [48.6142, 25.8581],
  [48.6031, 25.8494],
  [48.5976, 25.8529],
  [48.6002, 25.8779],
  [48.5873, 25.911],
  [48.5922, 25.9369],
  [48.6218, 25.9773],
  [48.6206, 25.9908],
  [48.6093, 26.0137],
  [48.6177, 26.0308],
  [48.6426, 26.0336],
  [48.6479, 26.0447],
  [48.6403, 26.0622],
  [48.6203, 26.0605],
  [48.6064, 26.0683],
  [48.584, 26.0464],
  [48.5706, 26.0595],
  [48.5605, 26.0778],
  [48.5417, 26.09],
  [48.5374, 26.0968],
  [48.5425, 26.1176],
  [48.5525, 26.1289],
  [48.567, 26.1273],
  [48.5812, 26.1074],
  [48.5896, 26.1064],
  [48.5991, 26.0977],
  [48.6134, 26.1027],
  [48.6199, 26.1188],
  [48.6175, 26.1257],
  [48.5995, 26.1458],
  [48.548, 26.1491],
  [48.5345, 26.1573],
  [48.528, 26.1699],
  [48.525, 26.199],
  [48.5397, 26.2702],
  [48.5357, 26.282],
  [48.5152, 26.295],
  [48.5086, 26.3037],
  [48.5164, 26.3274],
  [48.5075, 26.355],
  [48.512, 26.3681],
  [48.535, 26.3936],
  [48.5371, 26.4122],
  [48.5346, 26.4353],
  [48.5458, 26.4763],
  [48.5446, 26.488],
  [48.5312, 26.5023],
  [48.5197, 26.5043],
  [48.4876, 26.5366],
  [48.4586, 26.5548],
  [48.4538, 26.5682],
  [48.4521, 26.6023],
  [48.4551, 26.6197],
  [48.4622, 26.6289],
  [48.4708, 26.6273],
  [48.4946, 26.6104],
  [48.5072, 26.6139],
  [48.5062, 26.6369],
  [48.4879, 26.6538],
  [48.4855, 26.6604],
  [48.4861, 26.7007],
  [48.4942, 26.7172],
  [48.5075, 26.7113],
  [48.5252, 26.682],
  [48.5407, 26.6768],
  [48.5427, 26.6639],
  [48.5358, 26.6279],
  [48.5439, 26.6186],
  [48.5543, 26.6227],
  [48.5618, 26.6374],
  [48.5616, 26.6606],
  [48.5547, 26.6768],
  [48.5328, 26.7055],
  [48.5299, 26.7168],
  [48.5323, 26.7301],
  [48.539, 26.7424],
  [48.553, 26.7454],
  [48.5676, 26.7412],
  [48.5797, 26.7225],
  [48.5883, 26.7313],
  [48.5794, 26.7513],
  [48.5485, 26.7618],
  [48.5465, 26.7819],
  [48.5526, 26.791],
  [48.5667, 26.7988],
  [48.5883, 26.781],
  [48.5959, 26.7809],
  [48.6059, 26.7931],
  [48.6105, 26.8065],
  [48.6101, 26.8189],
  [48.5989, 26.829],
  [48.5825, 26.8219],
  [48.5586, 26.8418],
  [48.5449, 26.8652],
  [48.5412, 26.8812],
  [48.548, 26.9039],
  [48.5665, 26.9185],
  [48.5745, 26.9297],
  [48.5768, 26.9413],
  [48.5759, 26.9691],
  [48.5884, 26.992],
  [48.5708, 27.0013],
  [48.5573, 27.0868],
  [48.5582, 27.1193],
  [48.5655, 27.1355],
  [48.576, 27.1418],
  [48.5826, 27.1655],
  [48.5811, 27.1884],
  [48.5674, 27.2219],
  [48.5651, 27.2472],
  [48.5756, 27.2643],
  [48.583, 27.2661],
  [48.6002, 27.2523],
  [48.6074, 27.2392],
  [48.6225, 27.2471],
  [48.6257, 27.2644],
  [48.6229, 27.2824],
  [48.6039, 27.3056],
  [48.5994, 27.3216],
  [48.6067, 27.345],
  [48.629, 27.3538],
  [48.6303, 27.374],
  [48.6155, 27.4201],
  [48.5997, 27.4533],
  [48.5406, 27.483],
  [48.5079, 27.48],
  [48.483, 27.4998],
  [48.4722, 27.5167],
  [48.4704, 27.5339],
  [48.4555, 27.5032],
  [48.4583, 27.4914],
  [48.4526, 27.4726],
  [48.4317, 27.462],
  [48.4116, 27.4458],
  [48.4134, 27.4356],
  [48.4102, 27.4048],
  [48.4133, 27.3831],
  [48.4217, 27.378],
  [48.4362, 27.3801],
  [48.4497, 27.3514],
  [48.449, 27.341],
  [48.4411, 27.3378],
  [48.4432, 27.3208],
  [48.4289, 27.3107],
  [48.4206, 27.3113],
  [48.4093, 27.2972],
  [48.376, 27.2887],
  [48.3721, 27.2843],
  [48.3816, 27.2647],
  [48.3745, 27.236],
  [48.3899, 27.2149],
  [48.394, 27.1942],
  [48.3791, 27.1673],
  [48.3806, 27.161],
  [48.3744, 27.1393],
  [48.3801, 27.125],
  [48.3998, 27.1081],
  [48.4101, 27.0933],
  [48.4349, 27.0835],
  [48.4332, 27.0739],
  [48.4214, 27.0649],
  [48.4252, 27.0546],
  [48.4224, 27.0388],
  [48.4267, 27.0271],
  [48.4232, 27.0167],
  [48.4107, 27.0408],
  [48.4017, 27.0472],
  [48.3813, 27.0495],
  [48.3763, 27.0463],
  [48.3836, 27.0287],
  [48.3802, 27.0035],
  [48.3635, 27.0016],
  [48.3587, 26.9944],
  [48.3716, 26.9303],
  [48.3646, 26.9275],
  [48.3833, 26.8975],
  [48.3984, 26.8987],
  [48.4196, 26.8781],
  [48.4138, 26.8521],
  [48.4186, 26.7806],
  [48.3989, 26.7558],
  [48.4101, 26.728],
  [48.4039, 26.7153],
  [48.3546, 26.766],
  [48.3438, 26.7943],
  [48.3515, 26.8089],
  [48.3443, 26.823],
  [48.3243, 26.8308],
  [48.3134, 26.8298],
  [48.2942, 26.8154],
  [48.2922, 26.7972],
  [48.3008, 26.7759],
  [48.3207, 26.7597],
  [48.3134, 26.7425],
  [48.3569, 26.6966],
  [48.3553, 26.6864],
  [48.3281, 26.699],
  [48.3253, 26.6799],
  [48.3174, 26.6788],
  [48.3046, 26.6525],
  [48.2971, 26.6526],
  [48.2746, 26.6215],
  [48.2575, 26.6326],
  [48.2478, 26.6311],
  [48.24, 26.6216],
  [48.2391, 26.5987],
  [48.2464, 26.5877],
  [48.2414, 26.5747],
  [48.2313, 26.5709],
  [48.2199, 26.5731],
  [48.2256, 26.5528],
  [48.2159, 26.5489],
  [48.2088, 26.5263],
  [48.2164, 26.5035],
  [48.2157, 26.4818],
  [48.2201, 26.4709],
  [48.2132, 26.4589],
  [48.2059, 26.4571],
  [48.2008, 26.4236],
  [48.1897, 26.4067],
  [48.1866, 26.3886],
  [48.1974, 26.3763],
  [48.1855, 26.3615],
  [48.1842, 26.3347],
  [48.1771, 26.3286],
  [48.1595, 26.3362],
  [48.134, 26.2998],
  [48.1184, 26.2884],
  [48.0829, 26.2763],
  [48.0521, 26.2151],
  [48.0073, 26.2002],
  [47.9948, 26.1863],
  [47.985, 26.143],
  [47.9865, 26.1273],
  [47.9789, 26.1096],
  [47.9883, 26.0651],
  [47.9708, 25.9536],
  [47.9757, 25.9383],
  [47.9772, 25.9169],
  [47.9639, 25.9068],
  [47.9606, 25.8917],
  [47.9699, 25.8616],
  [47.9634, 25.8268],
  [47.9506, 25.8116],
  [47.9394, 25.776],
  [47.9417, 25.7402],
  [47.945, 25.732],
  [47.9417, 25.7168],
  [47.9442, 25.7076],
  [47.9424, 25.6847],
  [47.9501, 25.6486],
  [47.9486, 25.6241],
  [47.9382, 25.5899],
  [47.937, 25.5377],
  [47.9145, 25.3378],
  [47.9149, 25.3148],
  [47.8935, 25.2716],
  [47.8955, 25.2403],
  [47.8826, 25.2243],
  [47.8596, 25.2227],
  [47.8546, 25.2096],
  [47.8346, 25.1962],
  [47.8275, 25.1842],
  [47.8174, 25.1815],
  [47.8099, 25.169],
  [47.7999, 25.1717],
  [47.7894, 25.1622],
  [47.7905, 25.149],
  [47.7703, 25.1247],
  [47.7553, 25.1181],
  [47.7423, 25.0695],
  [47.7475, 25.0562],
  [47.7258, 25.041],
  [47.7348, 25.0093],
  [47.7258, 24.9988],
  [47.7301, 24.988],
  [47.7274, 24.923],
  [47.7525, 24.929],
  [47.76, 24.9376],
  [47.7943, 24.948],
  [47.8285, 24.9842],
  [47.8558, 24.998],
  [47.8597, 24.9829],
  [47.867, 24.9857],
  [47.8759, 24.9723],
  [47.8773, 24.9606],
  [47.8895, 24.9493],
  [47.8994, 24.946],
  [47.9034, 24.9604],
  [47.9185, 24.9572],
  [47.9308, 24.9426],
  [47.9378, 24.9259],
  [47.9464, 24.9195],
  [47.9753, 24.9169],
  [47.9961, 24.9087],
  [48.01, 24.9212],
  [48.0148, 24.9149],
  [48.028, 24.9141],
  [48.045, 24.9413],
  [48.05, 24.9428],
  [48.0705, 24.9686],
  [48.079, 24.9865],
  [48.0925, 24.9957],
  [48.1094, 24.9815],
  [48.1164, 24.9867],
  [48.1211, 25.0032],
  [48.1134, 25.0181],
  [48.1121, 25.0364],
  [48.1292, 25.0403],
  [48.1302, 25.0601],
  [48.1337, 25.0674],
  [48.1468, 25.074],
  [48.1597, 25.0683],
  [48.1639, 25.0938],
  [48.1739, 25.0841],
  [48.1824, 25.0865],
  [48.187, 25.1021],
  [48.1862, 25.1135],
  [48.1799, 25.1286],
  [48.1833, 25.1385],
  [48.1966, 25.1409],
  [48.2095, 25.117],
  [48.2202, 25.1199],
  [48.2254, 25.1086],
  [48.247, 25.1456],
  [48.2482, 25.1783],
  [48.2624, 25.1979],
  [48.2852, 25.2159],
  [48.2892, 25.2277],
  [48.3122, 25.2478],
  [48.3156, 25.2571],
  [48.3276, 25.263],
  [48.3774, 25.336],
  [48.3955, 25.4003],
  [48.3951, 25.4386],
  [48.4033, 25.4706],
  [48.3999, 25.4763],
  [48.4024, 25.5029],
  [48.3975, 25.5243],
  [48.3826, 25.548],
  [48.3833, 25.5816],
  [48.3798, 25.5854],
  [48.3827, 25.6154],
  [48.3993, 25.6259],
  [48.4159, 25.6239],
  [48.4485, 25.6043],
  [48.4967, 25.6013],
  [48.5218, 25.6097],
  [48.5422, 25.6013],
  [48.5504, 25.6058],
  [48.5576, 25.6015],
  [48.5711, 25.6057],
  [48.5737, 25.5993],
  [48.5897, 25.5912],
  [48.624, 25.5929],
  [48.6307, 25.5855],
  [48.6494, 25.6039],
  [48.6605, 25.6243],
  [48.6735, 25.6305],
]; // контур області [широта, довгота]
const inObl = (lat, lng) => {
  let c = false;
  for (let i = 0, j = OBL.length - 1; i < OBL.length; j = i++) {
    const [yi, xi] = OBL[i],
      [yj, xj] = OBL[j];
    if (
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    )
      c = !c;
  }
  return c;
};
const map = window.L
  ? L.map("mapEl", { zoomControl: false, zoomSnap: 0.25 })
  : null;
let layer = null,
  mk = {},
  OB = null,
  slotNow = "A",
  homed = false;
function limZoom() {
  if (map) map.setMinZoom(Math.max(5, map.getBoundsZoom(OB) - 0.75));
}
function fitHome() {
  if (!map) return;
  const s = map.getSize(),
    wide = s.x > 760 && $("slotA").contains($("mapEl"));
  map.setMinZoom(0);
  map.fitBounds(OB, {
    paddingTopLeft: [wide ? Math.round(s.x * 0.3) : 12, wide ? 70 : 12],
    paddingBottomRight: [12, wide ? 110 : 12],
    animate: false,
  });
  limZoom();
}
function locate() {
  if (!navigator.geolocation) {
    alert("Браузер не підтримує геолокацію.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (p) => {
      const la = p.coords.latitude,
        ln = p.coords.longitude;
      if (!inObl(la, ln)) {
        alert("Ви поза межами Чернівецької області, а карта показує лише її.");
        return;
      }
      map.setView([la, ln], 15);
    },
    () => alert("Не вдалося визначити місце. Дозвольте доступ до геолокації."),
    { timeout: 12000 },
  );
}
if (map) {
  OB = L.latLngBounds(OBL);
  map.setMaxBounds(OB.pad(0.7));
  map.options.maxBoundsViscosity = 1;
  map.setView(OB.getCenter(), 8);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    subdomains: "abcd",
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
  // непрозора «шторка» на все, що поза областю, і світла межа області
  map.createPane("mask");
  const mp = map.getPane("mask");
  mp.style.zIndex = 450;
  mp.style.pointerEvents = "none";
  L.polygon(
    [
      [
        [38, 14],
        [38, 40],
        [58, 40],
        [58, 14],
      ],
      OBL,
    ],
    {
      pane: "mask",
      stroke: false,
      fillColor: "#e4e2ee",
      fillOpacity: 1,
      interactive: false,
    },
  ).addTo(map);
  L.polygon(OBL, {
    pane: "mask",
    color: "#5b4bd6",
    weight: 2,
    opacity: 0.95,
    fill: false,
    interactive: false,
  }).addTo(map);
  const Loc = L.Control.extend({
    options: { position: "bottomright" },
    onAdd() {
      const box = L.DomUtil.create("div", "leaflet-bar loc-bar"),
        a = L.DomUtil.create("a", "", box);
      a.href = "#";
      a.setAttribute("role", "button");
      a.title = "Моє місце";
      a.setAttribute("aria-label", "Моє місце");
      a.innerHTML =
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 11 21 3l-8 18-2-8-8-2z"/></svg>';
      L.DomEvent.disableClickPropagation(box);
      L.DomEvent.on(a, "click", (e) => {
        L.DomEvent.preventDefault(e);
        locate();
      });
      return box;
    },
  });
  new Loc().addTo(map);
  L.control
    .zoom({
      position: "bottomright",
      zoomInTitle: "Збільшити",
      zoomOutTitle: "Зменшити",
    })
    .addTo(map);
  layer = L.layerGroup().addTo(map);
} else
  $("mapEl").innerHTML =
    '<p style="padding:20px">Не вдалося завантажити карту (Leaflet). Перевірте інтернет.</p>';
function drawMarkers() {
  if (!map) return;
  layer.clearLayers();
  mk = {};
  R.filter((r) => F.cat === "all" || r.cat === F.cat).forEach((r) => {
    const c = CATS[r.cat][2];
    const m = L.marker([r.lat, r.lng], {
      icon: L.divIcon({
        className: "",
        iconSize: [34, 34],
        iconAnchor: [17, 41],
        popupAnchor: [0, -40],
        html: `<div class="mk${r.st === "done" ? " dn" : ""}" style="--c:${c}"><span>${ICO[r.cat]}</span></div>`,
      }),
    }).addTo(layer);
    const thumb = r.hasPhoto
      ? `<img alt="" src="${esc(r.photo || "")}">`
      : `<span style="--c:${c}">${ICO[r.cat]}</span>`;
    m.bindPopup(
      `<div class="pp"><div class="pph">${thumb}<div><b>${esc(r.title)}</b><small>${esc(r.addr || "Адресу не вказано")}</small></div></div><div class="ppm">${CATS[r.cat][0]} · ${PR[r.pr]} · ${ago(r.t)}</div>${r.desc ? `<p>${esc(r.desc)}</p>` : ""}${stSel(r)}</div>`,
      { minWidth: 250 },
    );
    mk[r.id] = m;
  });
}
function focusOn(id) {
  location.hash = "#map";
  setTimeout(() => {
    const r = R.find((x) => x.id === id);
    if (map && r && mk[id]) {
      map.setView([r.lat, r.lng], 16);
      mk[id].openPopup();
    }
  }, 80);
}

/* відображення */
const opn = () => R.filter((r) => r.st !== "done");
const sorted = () => [...R].sort((a, b) => b.t - a.t);
const rowH = (r) =>
  `<tr data-id="${r.id}"><td><b>${esc(r.title)}</b>${r.hasPhoto ? " 📷" : ""}</td><td>${esc(r.addr || "—")}</td><td>${CATS[r.cat][1]} ${CATS[r.cat][0]}</td><td>${pill(r.st)}</td><td>${prc(r.pr)}</td><td>${dt(r.t)}</td></tr>`;
const head =
  "<thead><tr><th>Проблема</th><th>Адреса</th><th>Категорія</th><th>Статус</th><th>Пріоритет</th><th>Дата</th></tr></thead>";
function chipsH(el) {
  const L2 = [
    ["all", "Усі"],
    ["new", "Нові"],
    ["work", "У роботі"],
    ["done", "Вирішено"],
  ];
  el.innerHTML = L2.map(
    ([k, n]) =>
      `<button class="chip ${F.st === k ? "on" : ""}" data-s="${k}">${n} ${k === "all" ? R.length : R.filter((r) => r.st === k).length}</button>`,
  ).join("");
}
function catChipsH(el) {
  el.innerHTML = [
    ["all", "Усі"],
    ...Object.keys(CATS).map((k) => [k, CATS[k][0]]),
  ]
    .map(
      ([k, n]) =>
        `<button type="button" class="cchip ${F.cat === k ? "on" : ""}" data-k="${k}">${n}</button>`,
    )
    .join("");
}
const ago = (t) => {
  const h = (Date.now() - t) / 36e5;
  if (h < 1) return "щойно";
  if (h < 24) return Math.floor(h) + " год. тому";
  return Math.floor(h / 24) + " дн. тому";
};
const cardH = (r) =>
  `<div class="pc" data-id="${r.id}" tabindex="0" style="--c:${CATS[r.cat][2]}"><div class="pcimg">${
    r.hasPhoto
      ? `<img loading="lazy" alt="" src="${esc(r.photo || "")}">`
      : `<div class="big">${ICO[r.cat]}</div>`
  }<span class="bd">${ICO[r.cat]}</span>${pill(r.st)}</div><div class="pct"><b>${esc(r.title)}</b><small>${PIN}<span>${esc(r.addr || "Адресу не вказано")}</span></small><small>${CLK}<span>${ago(r.t)}</span></small></div></div>`;
function monthly() {
  const ms = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    ms.push(d);
  }
  return ms;
}
function sparkH() {
  const vals = monthly().map((d) => {
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
    return R.filter((r) => r.t < end).length;
  });
  const W = 300,
    H = 90,
    p = 10,
    mn = Math.min(...vals),
    mx = Math.max(...vals),
    n = vals.length - 1,
    x = (i) => p + (i * (W - 2 * p)) / n,
    y = (v) => H - 16 - ((v - mn) / (mx - mn || 1)) * (H - 40);
  let d = `M${x(0)} ${y(vals[0])}`;
  for (let i = 1; i <= n; i++) {
    const cx = (x(i - 1) + x(i)) / 2;
    d += ` C${cx} ${y(vals[i - 1])} ${cx} ${y(vals[i])} ${x(i)} ${y(vals[i])}`;
  }
  return `<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b7df5" stop-opacity=".35"/><stop offset="1" stop-color="#8b7df5" stop-opacity="0"/></linearGradient></defs><path d="${d} L${x(n)} ${H} L${x(0)} ${H}Z" fill="url(#sg)"/><path d="${d}" fill="none" stroke="#8b7df5" stroke-width="2.5" stroke-linecap="round"/><circle cx="${x(n)}" cy="${y(vals[n])}" r="5" fill="#fff" stroke="#8b7df5" stroke-width="3"/>`;
}
function render() {
  const hi = opn().filter((r) => r.pr === "high"),
    old = R.filter((r) => r.st === "new" && Date.now() - r.t > 7 * D);
  const avg = opn().length
    ? Math.round(
        opn().reduce((s, r) => s + (Date.now() - r.t) / D, 0) / opn().length,
      )
    : 0;
  $("att").innerHTML = [
    [
      `${hi.length} високого пріоритету`,
      "Ще не вирішені. Потрібна швидка реакція.",
      "Переглянути",
      "F.pr='high';F.st='all'",
    ],
    [
      `${old.length} нових понад тиждень`,
      "Досі без реакції служб.",
      "Переглянути",
      "F.pr='';F.st='new'",
    ],
    [
      `${R.filter((r) => r.st === "work").length} у роботі`,
      "Службі потрібно закрити їх у строк.",
      "Відкрити",
      "F.pr='';F.st='work'",
    ],
  ]
    .map(
      (a) =>
        `<div class="card"><b>${a[0]}</b><p>${a[1]}</p><button class="btn" onclick="${a[3]};location.hash='#list';show('list')">${a[2]}</button></div>`,
    )
    .join("");
  const tot = R.length,
    dn = R.filter((r) => r.st === "done").length;
  $("nTot").textContent = tot;
  $("nDone").textContent = (tot ? Math.round((dn / tot) * 100) : 0) + "%";
  $("kpis").innerHTML = [
    ["Нові", R.filter((r) => r.st === "new").length],
    ["У роботі", R.filter((r) => r.st === "work").length],
    ["Сер. вік відкритих", avg + " дн."],
  ]
    .map((k) => `<div><b>${k[1]}</b><small>${k[0]}</small></div>`)
    .join("");
  $("spark").innerHTML = sparkH();
  $("hi").innerHTML =
    [...opn()]
      .sort((a, b) => (b.pr === "high") - (a.pr === "high") || b.t - a.t)
      .slice(0, 3)
      .map(cardH)
      .join("") || '<p class="empty">Відкритих проблем немає.</p>';
  catChipsH($("mchips"));
  chipsH($("lchips"));
  const q = F.q.toLowerCase();
  const rows = sorted().filter(
    (r) =>
      (F.st === "all" || r.st === F.st) &&
      (!F.pr || r.pr === F.pr) &&
      (!q || (r.title + " " + r.addr).toLowerCase().includes(q)),
  );
  $("full").innerHTML =
    head +
    "<tbody>" +
    (rows.map(rowH).join("") ||
      '<tr><td colspan="6" style="color:var(--mute)">Нічого не знайдено.</td></tr>') +
    "</tbody>";
  drawStats();
  drawMarkers();
}
function drawStats() {
  const mx = Math.max(
    1,
    ...Object.keys(CATS).map((k) => R.filter((r) => r.cat === k).length),
  );
  $("bycat").innerHTML = Object.keys(CATS)
    .map((k) => {
      const n = R.filter((r) => r.cat === k).length;
      return `<div class="bar"><span>${CATS[k][1]} ${CATS[k][0]}</span><i style="width:${(n / mx) * 100}%"></i><b>${n}</b></div>`;
    })
    .join("");
  let a = 0;
  const parts = Object.keys(ST).map((k) => {
    const n = R.filter((r) => r.st === k).length,
      p = (n / (R.length || 1)) * 100,
      s = `${ST[k][1]} ${a}% ${a + p}%`;
    a += p;
    return s;
  });
  $("bystat").innerHTML =
    `<div class="donut" style="background:conic-gradient(${parts.join(",")})"></div><div>${Object.keys(
      ST,
    )
      .map((k) => `<p>${pill(k)} ${R.filter((r) => r.st === k).length}</p>`)
      .join("")}</div>`;
  const ms = monthly();
  const cn = ms.map(
      (d) =>
        R.filter((r) => {
          const x = new Date(r.t);
          return (
            x.getMonth() === d.getMonth() && x.getFullYear() === d.getFullYear()
          );
        }).length,
    ),
    m2 = Math.max(1, ...cn);
  $("bymon").innerHTML = ms
    .map(
      (d, i) =>
        `<div><b style="color:var(--ink)">${cn[i]}</b><i style="height:${(cn[i] / m2) * 100}%;min-height:3px"></i>${d.toLocaleDateString("uk-UA", { month: "short" })}</div>`,
    )
    .join("");
}

/* навігація */
const V = {
  overview: ["Центр керування", "Що відбувається в області сьогодні."],
  map: ["Карта проблем", "Натисніть на позначку, щоб побачити деталі."],
  list: ["Усі повідомлення", "Пошук і фільтри за статусом."],
  stats: ["Аналітика", "Статистика за поточними даними."],
};
function show(v) {
  if (!V[v]) v = "overview";
  Object.keys(V).forEach((k) => {
    $("v-" + k).hidden = k !== v;
  });
  document
    .querySelectorAll("nav a")
    .forEach((a) => a.classList.toggle("on", a.hash === "#" + v));
  $("phead").hidden = v === "overview";
  $("ttl").textContent = V[v][0];
  $("sub").textContent = V[v][1];
  if (v === "map") $("slotB").appendChild($("mapEl"));
  render();
  if (map && v === "map")
    setTimeout(() => {
      map.invalidateSize();
      limZoom();
      const sl = v === "map" ? "B" : "A";
      if (!homed) {
        homed = true;
        slotNow = sl;
        if (place) goPlace(place);
        else fitHome();
      } else if (sl !== slotNow) {
        // карту перенесено в інший блок — підганяємо область під його розмір
        slotNow = sl;
        if (place) goPlace(place);
        else fitHome();
      }
    }, 30);
  window.scrollTo(0, 0);
}
addEventListener("hashchange", () => show(location.hash.slice(1)));
document.addEventListener("click", (e) => {
  const k = e.target.closest(".cchip");
  if (k) {
    F.cat = k.dataset.k;
    render();
    return;
  }
  const c = e.target.closest(".chip");
  if (c) {
    F.st = c.dataset.s;
    F.pr = "";
    render();
    return;
  }
  const r = e.target.closest("tr[data-id],.pc[data-id]");
  if (r) focusOn(r.dataset.id);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const r = e.target.closest && e.target.closest(".pc[data-id]");
  if (r) focusOn(r.dataset.id);
});
$("q").oninput = (e) => {
  F.q = e.target.value;
  render();
};

/* нове повідомлення */
let pt = null,
  picking = false;
const f = $("f");
f.elements.c.innerHTML = Object.keys(CATS)
  .map((k) => `<option value="${k}">${CATS[k][1]} ${CATS[k][0]}</option>`)
  .join("");
const upd = () => {
  $("coord").textContent = pt
    ? `Місце обрано: ${pt.lat.toFixed(5)}, ${pt.lng.toFixed(5)}`
    : "Місце не обрано";
};
$("add").onclick = $("add2").onclick = () => {
  $("err").textContent = "";
  $("dlg").showModal();
};
$("cx").onclick = () => {
  $("dlg").close();
  f.reset();
  setPhoto(null);
  pt = null;
  upd();
};
$("pickb").onclick = () => {
  $("dlg").close();
  $("hintTxt").textContent =
    "Клікніть на карті всередині Чернівецької області, щоб обрати місце проблеми";
  location.hash = "#map";
  picking = true;
  $("hint").hidden = false;
};
$("nopick").onclick = () => {
  picking = false;
  $("hint").hidden = true;
  $("dlg").showModal();
};
if (map)
  map.on("click", (e) => {
    if (!picking) return;
    if (!inObl(e.latlng.lat, e.latlng.lng)) {
      $("hintTxt").textContent =
        "Ця точка поза межами Чернівецької області. Оберіть місце всередині неї.";
      return;
    }
    picking = false;
    $("hint").hidden = true;
    pt = e.latlng;
    upd();
    $("dlg").showModal();
  });
$("meb").onclick = () => {
  if (!navigator.geolocation) {
    $("err").textContent = "Браузер не підтримує геолокацію.";
    return;
  }
  $("err").textContent = "Шукаю вас…";
  navigator.geolocation.getCurrentPosition(
    (p) => {
      const la = p.coords.latitude,
        ln = p.coords.longitude;
      if (!inObl(la, ln)) {
        $("err").textContent =
          "Ви поза межами Чернівецької області. Оберіть місце на карті.";
        return;
      }
      pt = { lat: la, lng: ln };
      upd();
      $("err").textContent = "";
    },
    () => {
      $("err").textContent =
        "Не вдалося визначити місце. Дозвольте доступ або оберіть на карті.";
    },
    { timeout: 12000 },
  );
};
/* фото: камера або галерея */
let photo = null;
function setPhoto(d) {
  photo = d;
  $("prev").hidden = !d;
  if (d) $("pimg").src = d;
}
async function shrink(file) {
  if (!file.type.startsWith("image/")) throw 0;
  let bmp;
  try {
    bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch (e) {
    bmp = await new Promise((ok, no) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = no;
      im.src = URL.createObjectURL(file);
    });
  }
  const w = bmp.width || bmp.naturalWidth,
    h = bmp.height || bmp.naturalHeight,
    k = Math.min(1, 1280 / Math.max(w, h)),
    c = document.createElement("canvas");
  c.width = Math.round(w * k);
  c.height = Math.round(h * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  let q = 0.8,
    out = c.toDataURL("image/jpeg", q);
  while (out.length > 650000 && q > 0.4) {
    q -= 0.1;
    out = c.toDataURL("image/jpeg", q);
  }
  return out;
}
const onFile = async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  try {
    setPhoto(await shrink(file));
    $("err").textContent = "";
  } catch (err) {
    $("err").textContent =
      "Не вдалося обробити фото. Спробуйте інше (JPEG або PNG).";
  }
};
$("camb").onclick = () => $("cam").click();
$("galb").onclick = () => $("gal").click();
$("cam").onchange = $("gal").onchange = onFile;
$("prm").onclick = () => setPhoto(null);

f.onsubmit = async (e) => {
  e.preventDefault();
  if (!pt) {
    $("err").textContent = "Оберіть місце на карті або натисніть «Моє місце».";
    return;
  }
  if (!inObl(pt.lat, pt.lng)) {
    $("err").textContent = "Місце має бути в межах Чернівецької області.";
    return;
  }
  const x = f.elements,
    btn = f.querySelector("[type=submit]");
  btn.disabled = true;
  try {
    const r = await api("/api/reports", {
      method: "POST",
      body: JSON.stringify({
        title: x.t.value.trim(),
        addr: x.a.value.trim(),
        cat: x.c.value,
        pr: x.p.value,
        desc: x.d.value.trim(),
        lat: pt.lat,
        lng: pt.lng,
        photo: photo || undefined,
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      $("err").textContent =
        j.error || "Не вдалося надіслати. Спробуйте пізніше.";
      return;
    }
    f.reset();
    setPhoto(null);
    pt = null;
    upd();
    $("dlg").close();
    lastJSON = "";
    await load();
  } catch (err) {
    $("err").textContent = "Немає зв’язку із сервером.";
  } finally {
    btn.disabled = false;
  }
};

show(location.hash.slice(1) || "overview");

/* вибір місця: лише в межах Чернівецької області */
const HOME = { name: "Чернівецька область", home: true };
const QUICK = [
  ["Вся область", null],
  ["Чернівці", [48.2915, 25.9358, 13]],
  ["Хотин", [48.5115, 26.4935, 13]],
  ["Кіцмань", [48.4545, 25.784, 13]],
  ["Сторожинець", [48.1645, 25.712, 13]],
  ["Вижниця", [48.247, 25.188, 13]],
  ["Заставна", [48.523, 25.837, 13]],
  ["Глибока", [48.0833, 25.934, 13]],
  ["Сокиряни", [48.457, 27.404, 13]],
  ["Новодністровськ", [48.5744, 27.4264, 13]],
  ["Путила", [47.9667, 25.087, 13]],
];
let place = null;
try {
  const s = JSON.parse(localStorage.getItem("cp-place2") || "null");
  if (s && s.c && inObl(s.c[0], s.c[1])) place = s;
  else if (
    s &&
    s.b &&
    inObl((s.b[0][0] + s.b[1][0]) / 2, (s.b[0][1] + s.b[1][1]) / 2)
  )
    place = s;
} catch (e) {}
const goPlace = (p) => {
  if (!map) return;
  if (!p || p.home) return fitHome();
  if (p.b) map.fitBounds(p.b, { maxZoom: 16 });
  else map.setView([p.c[0], p.c[1]], p.c[2]);
};
const choose = (p) => {
  place = p.home ? null : p;
  try {
    localStorage.setItem("cp-place2", JSON.stringify(place));
  } catch (e) {}
  $("placeName").textContent = p.name;
  $("pdlg").close();
  // карта має бути видимою, щоб правильно порахувати розмір
  if ($("v-map").hidden && $("v-overview").hidden) location.hash = "#map";
  setTimeout(() => goPlace(p), 120);
};
$("pquick").innerHTML = QUICK.map(
  (q, i) =>
    `<button type="button" class="qchip" data-i="${i}">${q[0]}</button>`,
).join("");
$("pquick").onclick = (e) => {
  const b = e.target.closest(".qchip");
  if (!b) return;
  const q = QUICK[b.dataset.i];
  choose(q[1] ? { name: q[0], c: q[1] } : HOME);
};
$("place").onclick = () => {
  $("pmsg").textContent = "";
  $("pdlg").showModal();
  $("pq").focus();
};
$("pcl").onclick = () => $("pdlg").close();
$("psf").onsubmit = async (e) => {
  e.preventDefault();
  const q = $("pq").value.trim();
  if (!q) return;
  $("pres").innerHTML = "";
  $("pmsg").textContent = "Шукаю…";
  try {
    // шукаємо лише всередині меж області
    const r = await fetch(
      "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=15&countrycodes=ua&bounded=1&viewbox=24.9,48.68,27.54,47.72&accept-language=uk&q=" +
        encodeURIComponent(q),
    );
    const data = (await r.json()).filter((d) => inObl(+d.lat, +d.lon));
    if (!data.length) {
      $("pmsg").textContent =
        "У Чернівецькій області нічого не знайдено. Спробуйте іншу назву.";
      return;
    }
    $("pmsg").textContent = "";
    $("pres").innerHTML = data
      .map((d, i) => {
        const parts = d.display_name.split(", ");
        return `<li tabindex="0" data-i="${i}"><b>${esc(parts[0])}</b><small>${esc(parts.slice(1, -1).join(", "))}</small></li>`;
      })
      .join("");
    $("pres").onclick = $("pres").onkeydown = (ev) => {
      if (ev.type === "keydown" && ev.key !== "Enter") return;
      const li = ev.target.closest("li[data-i]");
      if (!li) return;
      const d = data[li.dataset.i],
        bb = d.boundingbox.map(Number); // пд, пн, зах, сх
      choose({
        name: d.display_name.split(", ")[0],
        b: [
          [bb[0], bb[2]],
          [bb[1], bb[3]],
        ],
      });
    };
  } catch (err) {
    $("pmsg").textContent = "Не вдалося виконати пошук. Перевірте інтернет.";
  }
};
if (place) $("placeName").textContent = place.name;

/* режим адміністратора і автооновлення */
function updAdm() {
  const b = $("adm");
  b.classList.toggle("on", !!adminKey);
  b.title = adminKey ? "Вийти з режиму адміністратора" : "Режим адміністратора";
  b.setAttribute("aria-label", b.title);
  render();
}
$("adm").onclick = async () => {
  if (adminKey) {
    adminKey = "";
    try {
      sessionStorage.removeItem("cp-admin");
    } catch (e) {}
    updAdm();
    return;
  }
  const k = prompt("Ключ адміністратора:");
  if (!k) return;
  try {
    const r = await fetch(API + "/api/admin/check", {
      headers: { "x-admin-key": k },
    });
    if (!r.ok) throw 0;
    adminKey = k;
    try {
      sessionStorage.setItem("cp-admin", k);
    } catch (e) {}
    updAdm();
  } catch (e) {
    alert("Невірний ключ або немає зв’язку із сервером.");
  }
};
updAdm();
load();
setInterval(load, 30000);
