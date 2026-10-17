const CATS = {
  road: ["Дороги", "🕳️"],
  light: ["Освітлення", "💡"],
  trash: ["Сміття", "🗑️"],
  walk: ["Тротуари", "🚶"],
  pub: ["Громадські місця", "🌳"],
  other: ["Інше", "❓"],
};
const ST = {
  new: ["Нове", "#dc2626"],
  work: ["У роботі", "#d97706"],
  done: ["Вирішено", "#16a34a"],
};
const PR = { high: "Високий", mid: "Середній", low: "Низький" };
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
      "Дані спільні для всіх користувачів. Оновлено " +
        new Date().toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    );
  } catch (e) {
    sync("Немає зв’язку із сервером. Запустіть його командою npm start.");
  }
}
const F = { st: "all", q: "", pr: "" };
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
    ? `<a href="${API}/api/reports/${r.id}/photo" target="_blank" rel="noopener"><img class="ph" loading="lazy" alt="Фото проблеми" src="${API}/api/reports/${r.id}/photo"></a>`
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
const map = window.L ? L.map("map").setView([50.4501, 30.5234], 12) : null;
let layer = null,
  mk = {};
if (map) {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);
  layer = L.layerGroup().addTo(map);
} else
  $("map").innerHTML =
    '<p style="padding:20px">Не вдалося завантажити карту (Leaflet). Перевірте інтернет.</p>';
function drawMarkers() {
  if (!map) return;
  layer.clearLayers();
  mk = {};
  R.filter((r) => F.st === "all" || r.st === F.st).forEach((r) => {
    const m = L.marker([r.lat, r.lng], {
      icon: L.divIcon({
        className: "",
        iconSize: [30, 30],
        html: `<div class="mk" style="background:${ST[r.st][1]}">${CATS[r.cat][1]}</div>`,
      }),
    }).addTo(layer);
    m.bindPopup(
      `<b>${esc(r.title)}</b><p>${esc(r.addr || "Адресу не вказано")}<br>${CATS[r.cat][0]} · ${PR[r.pr]} · ${age(r.t)}</p>${photoH(r)}${r.desc ? `<p>${esc(r.desc)}</p>` : ""}${stSel(r)}`,
      { minWidth: 220 },
    );
    mk[r.id] = m;
  });
}
function focusOn(id) {
  location.hash = "#map";
  setTimeout(() => {
    const r = R.find((x) => x.id === id);
    if (map && mk[id]) {
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
  $("kpis").innerHTML = [
    ["📋", "Усього повідомлень", R.length],
    ["🆕", "Нові", R.filter((r) => r.st === "new").length],
    ["🛠️", "У роботі", R.filter((r) => r.st === "work").length],
    ["✅", "Вирішено", R.filter((r) => r.st === "done").length],
    ["⏱️", "Середній вік відкритих", avg + " дн."],
  ]
    .map(
      (k) =>
        `<div class="card kpi"><small>${k[0]} ${k[1]}</small><b>${k[2]}</b></div>`,
    )
    .join("");
  $("hi").innerHTML =
    hi
      .sort((a, b) => a.t - b.t)
      .slice(0, 5)
      .map(
        (r) =>
          `<div class="pr" data-id="${r.id}"><div class="ic">${CATS[r.cat][1]}</div><div><b>${esc(r.title)}</b><small>${esc(r.addr || "")} · ${age(r.t)}</small></div>${stSel(r)}</div>`,
      )
      .join("") ||
    '<p style="color:var(--mute)">Немає проблем високого пріоритету.</p>';
  $("recent").innerHTML =
    head +
    "<tbody>" +
    (sorted().slice(0, 5).map(rowH).join("") ||
      '<tr><td colspan="6" style="color:var(--mute)">Повідомлень ще немає. Станьте першими!</td></tr>') +
    "</tbody>";
  chipsH($("mchips"));
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
  const ms = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    ms.push(d);
  }
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
  overview: ["Центр керування", "Що відбувається у місті сьогодні."],
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
  $("ttl").textContent = V[v][0];
  $("sub").textContent = V[v][1];
  if (v === "overview") $("slotA").appendChild($("map"));
  if (v === "map") $("slotB").appendChild($("map"));
  if (map) setTimeout(() => map.invalidateSize(), 30);
  render();
}
addEventListener("hashchange", () => show(location.hash.slice(1)));
document.addEventListener("click", (e) => {
  const c = e.target.closest(".chip");
  if (c) {
    F.st = c.dataset.s;
    F.pr = "";
    render();
    return;
  }
  const r = e.target.closest("tr[data-id],.pr[data-id]");
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
$("add").onclick = () => {
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
      pt = { lat: p.coords.latitude, lng: p.coords.longitude };
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

/* вибір міста, області або країни */
const QUICK = [
  ["Україна", [48.4, 31.2, 6]],
  ["Київ, Україна", [50.4501, 30.5234, 12]],
  ["Львів, Україна", [49.8397, 24.0297, 12]],
  ["Одеса, Україна", [46.4825, 30.7233, 12]],
  ["Харків, Україна", [49.9935, 36.2304, 12]],
  ["Дніпро, Україна", [48.4647, 35.0462, 12]],
];
let place = null;
try {
  place = JSON.parse(localStorage.getItem("cp-place") || "null");
} catch (e) {}
const goPlace = (p) => {
  if (!map || !p) return;
  if (p.b) map.fitBounds(p.b);
  else map.setView([p.c[0], p.c[1]], p.c[2]);
};
const choose = (p) => {
  place = p;
  try {
    localStorage.setItem("cp-place", JSON.stringify(p));
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
  choose({ name: q[0], c: q[1] });
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
    const r = await fetch(
      "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=uk&q=" +
        encodeURIComponent(q),
    );
    const data = await r.json();
    if (!data.length) {
      $("pmsg").textContent = "Нічого не знайдено. Спробуйте іншу назву.";
      return;
    }
    $("pmsg").textContent = "";
    $("pres").innerHTML = data
      .map((d, i) => {
        const parts = d.display_name.split(", ");
        return `<li tabindex="0" data-i="${i}"><b>${esc(parts[0])}</b><small>${esc(parts.slice(1).join(", "))}</small></li>`;
      })
      .join("");
    $("pres").onclick = $("pres").onkeydown = (ev) => {
      if (ev.type === "keydown" && ev.key !== "Enter") return;
      const li = ev.target.closest("li[data-i]");
      if (!li) return;
      const d = data[li.dataset.i],
        parts = d.display_name.split(", "),
        bb = d.boundingbox.map(Number); // пд, пн, зах, сх
      choose({
        name:
          parts.length > 1
            ? parts[0] + ", " + parts[parts.length - 1]
            : parts[0],
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
if (place) {
  $("placeName").textContent = place.name;
  setTimeout(() => goPlace(place), 150);
}

/* режим адміністратора і автооновлення */
function updAdm() {
  $("adm").textContent = adminKey
    ? "🔓 Вийти з режиму адміна"
    : "🔑 Режим адміністратора";
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
