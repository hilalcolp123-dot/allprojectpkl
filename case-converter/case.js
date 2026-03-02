const area = document.getElementById("textInput");

function convert(type) {
  let val = area.value.trim();
  if (!val) return;

  switch (type) {
    case "upper":
      area.value = val.toUpperCase();
      break;
    case "lower":
      area.value = val.toLowerCase();
      break;
    case "capitalized":
      area.value = val
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      break;
    case "title":
      area.value = val
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
      break;
    case "inverse":
      area.value = val
        .split("")
        .map((c) =>
          c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase(),
        )
        .join("");
      break;
  }
}

function copyText() {
  if (!area.value) return;
  navigator.clipboard
    .writeText(area.value)
    .then(() => alert("Teks berhasil disalin!"))
    .catch(() => alert("Gagal menyalin teks"));
}

function clearText() {
  if (confirm("Hapus semua teks?")) {
    area.value = "";
    area.focus();
  }
}

const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const cancelBtn = document.getElementById("cancelBtn");
const overlay = document.getElementById("modalOverlay");

// Fungsi buka modal
openBtn.onclick = () => overlay.classList.add("active");

// Fungsi tutup modal
const closeModal = () => overlay.classList.remove("active");

closeBtn.onclick = closeModal;
cancelBtn.onclick = closeModal;

// Tutup jika user klik di area luar modal (overlay)
window.onclick = (event) => {
  if (event.target == overlay) closeModal();
};
