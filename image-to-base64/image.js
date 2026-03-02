// Image to Base64 Converter - JavaScript
// Versi rapi & modular (2026 style)

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const elements = {
    uploadArea: document.getElementById("uploadArea"),
    fileInput: document.getElementById("fileInput"),
    previewContainer: document.getElementById("previewContainer"),
    previewImage: document.getElementById("previewImage"),
    previewFilename: document.getElementById("previewFilename"),
    fileSize: document.getElementById("fileSize"),
    fileType: document.getElementById("fileType"),
    convertBtn: document.getElementById("convertBtn"),
    copyBtn: document.getElementById("copyBtn"),
    resultArea: document.getElementById("resultArea"),
    base64Output: document.getElementById("base64Output"),
    placeholderResult: document.getElementById("placeholderResult"),
    toastContainer: document.getElementById("toastContainer"),
  };

  let currentFile = null;
  let base64Result = "";

  // ======================
  // Utility Functions
  // ======================
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function getMimeType(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const mimeMap = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      svg: "image/svg+xml",
      webp: "image/webp",
      bmp: "image/bmp",
      ico: "image/x-icon",
    };
    return mimeMap[ext] || `image/${ext}`;
  }

  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = "toast-notification mb-2";

    const config = {
      success: {
        bg: "bg-success",
        icon: "fa-check-circle",
        text: "text-white",
      },
      danger: {
        bg: "bg-danger",
        icon: "fa-exclamation-circle",
        text: "text-white",
      },
      warning: {
        bg: "bg-warning",
        icon: "fa-exclamation-triangle",
        text: "text-dark",
      },
      info: { bg: "bg-info", icon: "fa-info-circle", text: "text-white" },
    }[type] || { bg: "bg-info", icon: "fa-info-circle", text: "text-white" };

    toast.innerHTML = `
      <div class="${config.bg} ${config.text} p-3 rounded d-flex align-items-center">
        <i class="fas ${config.icon} me-2 fs-5"></i>
        <span>${message}</span>
      </div>
    `;

    elements.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  // ======================
  // File Handling
  // ======================
  function handleFile(file) {
    // Validasi
    if (!file.type.startsWith("image/")) {
      showToast("File bukan gambar! Pilih file gambar saja.", "danger");
      return;
    }

    // Opsional: batasi ukuran (contoh max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast("Ukuran file terlalu besar! Maksimal 10 MB.", "warning");
      return;
    }

    currentFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      elements.previewImage.src = e.target.result;
      elements.previewFilename.textContent = file.name;
      elements.fileSize.textContent = formatFileSize(file.size);
      elements.fileType.textContent = file.type || getMimeType(file.name);

      // Switch UI
      elements.uploadArea.style.display = "none";
      elements.previewContainer.classList.add("active");
      elements.convertBtn.disabled = false;

      showToast("Gambar berhasil diupload!", "success");
    };
    reader.onerror = () => showToast("Gagal membaca file gambar.", "danger");
    reader.readAsDataURL(file);
  }

  // ======================
  // Event Listeners
  // ======================
  // Klik area → buka file picker
  elements.uploadArea.addEventListener("click", () => {
    elements.fileInput.click();
  });

  // Pilih file via input
  elements.fileInput.addEventListener("change", (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  });

  // Drag & Drop
  elements.uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    elements.uploadArea.classList.add("dragover");
  });

  elements.uploadArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    elements.uploadArea.classList.remove("dragover");
  });

  elements.uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    elements.uploadArea.classList.remove("dragover");
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  });

  // Konversi ke Base64
  window.convertToBase64 = function () {
    if (!currentFile) {
      showToast("Silakan upload gambar terlebih dahulu!", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      base64Result = e.target.result;

      elements.base64Output.textContent = base64Result;
      elements.resultArea.classList.add("active");
      elements.placeholderResult.classList.add("d-none");
      elements.copyBtn.disabled = false;

      showToast("Konversi ke Base64 berhasil!", "success");
    };
    reader.onerror = () => showToast("Gagal mengkonversi gambar.", "danger");
    reader.readAsDataURL(currentFile);
  };

  // Copy ke clipboard
  window.copyBase64 = function () {
    if (!base64Result) {
      showToast("Belum ada hasil Base64 untuk disalin!", "warning");
      return;
    }

    navigator.clipboard
      .writeText(base64Result)
      .then(() => showToast("Base64 berhasil disalin ke clipboard!", "success"))
      .catch((err) => {
        console.error("Copy gagal:", err);
        showToast("Gagal menyalin Base64.", "danger");
      });
  };

  // Hapus gambar & reset
  window.removeImage = function () {
    currentFile = null;
    base64Result = "";

    elements.fileInput.value = "";
    elements.uploadArea.style.display = "flex";
    elements.previewContainer.classList.remove("active");
    elements.resultArea.classList.remove("active");
    elements.placeholderResult.classList.remove("d-none");
    elements.convertBtn.disabled = true;
    elements.copyBtn.disabled = true;

    showToast("Gambar telah dihapus.", "info");
  };
});
