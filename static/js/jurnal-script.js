/** PWA Manifest Injection (Bypassing single file limit) */
const manifest = {
  name: "Jurnal PKL PWA",
  short_name: "JurnalPKL",
  start_url: ".",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#4f46e5",
  icons: [
    {
      src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzRmNDZlNSIvPjwvc3ZnPg==",
      sizes: "192x192",
      type: "image/svg+xml",
    },
  ],
};
document.getElementById("pwa-manifest").href =
  "data:application/manifest+json;charset=utf-8," +
  encodeURIComponent(JSON.stringify(manifest));

/** Service Worker for Offline & Notifications */
const swCode = `
            self.addEventListener('install', e => self.skipWaiting());
            self.addEventListener('activate', e => e.waitUntil(clients.claim()));
            self.addEventListener('fetch', e => { /* Cache logic omitted for simplicity in single file */ });
            self.addEventListener('push', e => {
                const title = 'Pengingat Jurnal PKL';
                const options = { body: e.data ? e.data.text() : 'Jangan lupa mengisi jurnal hari ini.', icon: '' };
                e.waitUntil(self.registration.showNotification(title, options));
            });
        `;
const swBlob = new Blob([swCode], { type: "application/javascript" });
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service Worker registered", reg))
      .catch((err) => console.error("SW failed:", err));
  });
}

/** =========================================
 * INDEXED_DB WRAPPER
 * ========================================= */
const DB_NAME = "pklJournalDB";
const DB_VERSION = 1;
const STORE_NAME = "journals";

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("date", "date", { unique: true });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

const getAllJournals = async () => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () =>
      resolve(req.result.sort((a, b) => new Date(b.date) - new Date(a.date)));
    req.onerror = () => reject(req.error);
  });
};

const getJournalByDate = async (dateStr) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("date");
    const req = index.get(dateStr);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

const addJournal = async (journalData) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(journalData);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

const updateJournal = async (journalData) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(journalData);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

const deleteJournal = async (id) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

/** =========================================
 * STATE & APP LOGIC
 * ========================================= */
let journals = []; // Memory cache
let currentJournalId = null;
let currentPhotoBlob = null; // Storing Blob temporarily from input file

const getTodayYMD = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};
const formatDateIndo = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const generateId = () => "jnl_" + Date.now().toString(36);
const showToast = (msg) => {
  const t = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = msg;
  t.classList.remove("translate-x-full", "opacity-0");
  setTimeout(() => t.classList.add("translate-x-full", "opacity-0"), 2500);
};

async function initApp() {
  document.getElementById("today-date-display").textContent =
    formatDateIndo(getTodayYMD());
  journals = await getAllJournals();
  navTo("dashboard");
  startReminderCron();
}

// NAVIGATION
const views = ["dashboard", "write", "history", "detail"];
function navTo(viewName) {
  views.forEach((v) =>
    document.getElementById(`view-${v}`).classList.add("hidden"),
  );
  document.getElementById(`view-${viewName}`).classList.remove("hidden");

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("text-primary");
    btn.classList.add("text-gray-400");
  });

  if (viewName !== "detail") {
    const activeBtn = document.getElementById(`nav-${viewName}`);
    activeBtn.classList.remove("text-gray-400");
    activeBtn.classList.add("text-primary");
  }

  if (viewName === "dashboard") renderDashboard();
  if (viewName === "write") setupWriteForm();
  if (viewName === "history") renderHistory();
  window.scrollTo(0, 0);
}

async function renderDashboard() {
  const todayStr = getTodayYMD();
  const todayJnl = await getJournalByDate(todayStr);
  const statusCard = document.getElementById("status-card");
  const sIcon = document.getElementById("status-icon");

  if (todayJnl) {
    statusCard.className =
      "rounded-2xl p-4 shadow-sm border border-green-200 bg-green-50 dark:bg-green-900/20 flex items-center justify-between cursor-pointer";
    sIcon.className =
      "h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-green-200 text-green-700";
    sIcon.innerHTML = '<i class="fas fa-check"></i>';
    document.getElementById("status-text").innerHTML =
      '<span class="text-green-700 dark:text-green-400">Jurnal hari ini selesai!</span>';
  } else {
    statusCard.className =
      "rounded-2xl p-4 shadow-sm border border-red-200 bg-red-50 dark:bg-red-900/20 flex items-center justify-between cursor-pointer";
    sIcon.className =
      "h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-red-200 text-red-700";
    sIcon.innerHTML = '<i class="fas fa-exclamation"></i>';
    document.getElementById("status-text").innerHTML =
      '<span class="text-red-700 dark:text-red-400">Belum isi jurnal, yuk isi!</span>';
  }
  document.getElementById("stat-total").textContent = journals.length;
}

// FORM & BLOB UPLOAD
const form = document.getElementById("journal-form");
const fId = document.getElementById("entry-id");
const fDate = document.getElementById("entry-date");
const fTitle = document.getElementById("entry-title");
const fDesc = document.getElementById("entry-desc");
const fNotes = document.getElementById("entry-notes");

function setupWriteForm() {
  if (!fId.value) {
    fDate.value = getTodayYMD();
    document.getElementById("form-title").textContent = "Tulis Jurnal";
    resetImagePreview();
  }
}

function previewBlobImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  currentPhotoBlob = file; // Save original Blob (File inherits from Blob)

  // Create temporary URL for preview
  const objectUrl = URL.createObjectURL(file);
  document.getElementById("image-placeholder").classList.add("hidden");
  const preview = document.getElementById("image-preview");
  preview.src = objectUrl;
  preview.classList.remove("hidden");
}

function resetImagePreview() {
  currentPhotoBlob = null;
  document.getElementById("entry-image").value = "";
  document.getElementById("image-placeholder").classList.remove("hidden");
  document.getElementById("image-preview").classList.add("hidden");
  document.getElementById("image-preview").src = "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    id: fId.value || generateId(),
    date: fDate.value,
    title: fTitle.value,
    description: fDesc.value,
    notes: fNotes.value,
    photoBlob: currentPhotoBlob, // Menyimpan BLOB langsung ke IndexedDB
    createdAt: Date.now(),
  };

  try {
    if (fId.value) {
      await updateJournal(data);
      showToast("Jurnal diupdate!");
    } else {
      const exist = await getJournalByDate(fDate.value);
      if (exist) {
        if (!confirm("Sudah ada jurnal di tanggal ini. Timpa?")) return;
        data.id = exist.id; // Override existing ID
        await updateJournal(data);
      } else {
        await addJournal(data);
      }
      showToast("Tersimpan di IndexedDB!");
    }

    journals = await getAllJournals(); // Refresh Cache
    fId.value = "";
    form.reset();
    resetImagePreview();
    navTo("history");
  } catch (err) {
    alert("Gagal menyimpan ke Database: " + err);
  }
});

// HISTORY & DETAIL (OBJECT URLs)
function renderHistory() {
  const container = document.getElementById("history-list");
  container.innerHTML = "";
  if (journals.length === 0) {
    container.innerHTML = `<div class="text-center py-8 opacity-50"><p class="text-sm">Data tidak ditemukan</p></div>`;
    return;
  }
  journals.forEach((jnl) => {
    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-gray-800 p-4 rounded-xl border shadow-sm cursor-pointer flex gap-3";
    card.onclick = () => openDetail(jnl.id);
    card.innerHTML = `
                    <div class="flex-1">
                        <p class="text-[10px] font-semibold text-gray-400 uppercase">${formatDateIndo(jnl.date)}</p>
                        <h3 class="font-bold text-sm line-clamp-1">${jnl.title}</h3>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-1">${jnl.description}</p>
                    </div>
                    ${jnl.photoBlob ? '<div class="flex items-center text-primary"><i class="fas fa-image"></i></div>' : ""}
                `;
    container.appendChild(card);
  });
}

function openDetail(id) {
  const jnl = journals.find((j) => j.id === id);
  if (!jnl) return;
  currentJournalId = id;

  document.getElementById("detail-date").textContent = formatDateIndo(jnl.date);
  document.getElementById("detail-title").textContent = jnl.title;
  document.getElementById("detail-notes").textContent = jnl.notes || "";
  document.getElementById("detail-desc").textContent = jnl.description;

  const imgContainer = document.getElementById("detail-image-container");
  const imgEl = document.getElementById("detail-image");
  const btnDownload = document.getElementById("btn-download-photo");

  if (jnl.photoBlob) {
    // Konversi Blob dari IndexedDB menjadi Object URL
    const objectUrl = URL.createObjectURL(jnl.photoBlob);
    imgEl.src = objectUrl;
    imgContainer.classList.remove("hidden");

    // Set aksi download foto asli
    btnDownload.onclick = () => {
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `Foto_Jurnal_${jnl.date}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  } else {
    imgContainer.classList.add("hidden");
  }
  navTo("detail");
}

async function editCurrentJournal() {
  const jnl = journals.find((j) => j.id === currentJournalId);
  document.getElementById("form-title").textContent = "Edit Jurnal";
  fId.value = jnl.id;
  fDate.value = jnl.date;
  fTitle.value = jnl.title;
  fDesc.value = jnl.description;
  fNotes.value = jnl.notes || "Programming";

  currentPhotoBlob = jnl.photoBlob || null;
  if (currentPhotoBlob) {
    const objectUrl = URL.createObjectURL(currentPhotoBlob);
    document.getElementById("image-placeholder").classList.add("hidden");
    const preview = document.getElementById("image-preview");
    preview.src = objectUrl;
    preview.classList.remove("hidden");
  } else resetImagePreview();

  navTo("write");
}

async function deleteCurrentJournal() {
  if (confirm("Hapus jurnal ini dari IndexedDB selamanya?")) {
    await deleteJournal(currentJournalId);
    journals = await getAllJournals();
    showToast("Terhapus");
    navTo("history");
  }
}

/** =========================================
 * REMINDER NOTIFICATION SYSTEM
 * ========================================= */
function requestNotification() {
  if (!("Notification" in window)) {
    alert("Browser tidak mendukung notifikasi.");
  } else if (Notification.permission === "granted") {
    showToast("Notifikasi sudah aktif.");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") showToast("Notifikasi diizinkan!");
    });
  }
}

function startReminderCron() {
  // Check setiap menit apakah sudah jam 20:00
  setInterval(async () => {
    const now = new Date();
    // Jika waktu menunjukkan jam 20:00 (Malam)
    if (now.getHours() === 20 && now.getMinutes() === 0) {
      const lastNotified = localStorage.getItem("last_notified_date");
      const todayStr = getTodayYMD();

      // Pastikan notifikasi hanya muncul 1x sehari
      if (lastNotified !== todayStr) {
        const todayJnl = await getJournalByDate(todayStr);
        // Jika tidak ada jurnal hari ini, kirim Push Notification
        if (!todayJnl) {
          if (Notification.permission === "granted") {
            navigator.serviceWorker.ready.then((reg) => {
              reg.showNotification("Pengingat Jurnal PKL", {
                body: "Jangan lupa mengisi jurnal PKL kamu hari ini ya!",
                icon: "https://cdn-icons-png.flaticon.com/512/3234/3234972.png",
                vibrate: [200, 100, 200],
              });
            });
          }
          localStorage.setItem("last_notified_date", todayStr);
        }
      }
    }
  }, 60000); // interval 1 menit
}

/** THEME TOGGLE */
const html = document.documentElement;
const themeIcon = document.getElementById("theme-icon");
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  html.classList.add("dark");
  themeIcon.className = "fas fa-sun text-yellow-500";
}
document.getElementById("theme-toggle").addEventListener("click", () => {
  html.classList.toggle("dark");
  const isDark = html.classList.contains("dark");
  localStorage.theme = isDark ? "dark" : "light";
  themeIcon.className = isDark ? "fas fa-sun text-yellow-500" : "fas fa-moon";
});

/** INIT APP */
window.onload = initApp;
