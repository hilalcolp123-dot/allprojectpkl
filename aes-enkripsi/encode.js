/**
 * AES-256 Encryption & Decryption using Web Crypto API
 * Khusus untuk halaman Enkripsi & Dekripsi - AES-256
 */

// ======================
// AES-256 Functions
// ======================
async function aes256Encrypt(text, passphrase, caseMode = "maintain") {
  if (!passphrase) return "Kunci tidak boleh kosong!";

  try {
    // Generate key dari passphrase menggunakan PBKDF2 + SHA-256
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(passphrase),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"],
    );

    // Salt tetap (untuk konsistensi, di production sebaiknya random & disimpan)
    const salt = new TextEncoder().encode("apkenkripsi-salt");

    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );

    // IV random 12 bytes (standar AES-GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Enkripsi
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      new TextEncoder().encode(text),
    );

    // Gabungkan IV + ciphertext, lalu encode ke base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    let result = btoa(String.fromCharCode(...combined));

    // Terapkan case mode
    if (caseMode === "upper") return result.toUpperCase();
    if (caseMode === "lower") return result.toLowerCase();
    return result;
  } catch (e) {
    console.error("Enkripsi error:", e);
    return "Enkripsi gagal: " + e.message;
  }
}

async function aes256Decrypt(ciphertext, passphrase, caseMode = "maintain") {
  if (!passphrase) return "Kunci tidak boleh kosong!";

  try {
    // Decode base64 → Uint8Array
    const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

    // Pisahkan IV (12 byte pertama) dan ciphertext
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Generate key sama seperti enkripsi
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(passphrase),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"],
    );

    const salt = new TextEncoder().encode("apkenkripsi-salt");

    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );

    // Dekripsi
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encrypted,
    );

    let result = new TextDecoder().decode(decrypted);

    // Terapkan case mode (meskipun biasanya plaintext asli sudah sesuai)
    if (caseMode === "upper") return result.toUpperCase();
    if (caseMode === "lower") return result.toLowerCase();
    return result;
  } catch (e) {
    console.error("Dekripsi error:", e);
    return "Dekripsi gagal! Kemungkinan kunci salah atau data rusak.";
  }
}

// ======================
// UI Functions khusus AES
// ======================
function copyToClipboard(elementId) {
  const textarea = document.getElementById(elementId);
  const text = textarea.value.trim();
  if (!text) {
    showAlert("Tidak ada teks untuk disalin!", "danger");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showAlert("Berhasil disalin ke clipboard!", "success"))
    .catch((err) => {
      console.error("Gagal copy:", err);
      showAlert("Gagal menyalin teks.", "danger");
    });
}

function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    <strong>${type === "success" ? "Berhasil!" : type === "danger" ? "Error!" : "Peringatan!"}</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  const container =
    document.querySelector("#alertsContainer") ||
    document.querySelector(".container");
  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => alertDiv.remove(), 5000);
}

function clearAesForm() {
  document.getElementById("inputTextarea").value = "";
  document.getElementById("resultTextarea").value = "";
  document.getElementById("aesKey").value = "";
  document.getElementById("caseMode").value = "maintain";

  // Reset ke mode enkripsi jika perlu
  const isDecryptMode = window.isDecryptMode; // dari script inline halaman AES
  if (isDecryptMode) {
    toggleEncryptDecrypt(); // panggil fungsi toggle yang ada di halaman
  }
}

// ======================
// Process AES (dipanggil dari tombol)
// ======================
async function processAES() {
  const inputText = document.getElementById("inputTextarea").value;
  const key = document.getElementById("aesKey").value;
  const caseMode = document.getElementById("caseMode").value;

  // Cek mode dari variabel global (dari script inline halaman AES)
  const isDecryptMode = window.isDecryptMode || false;

  if (!key.trim()) {
    showAlert("Masukkan kunci/password!", "danger");
    return;
  }

  let result;

  if (isDecryptMode) {
    if (!inputText.trim()) {
      showAlert("Masukkan teks yang ingin didekripsi!", "danger");
      return;
    }
    result = await aes256Decrypt(inputText, key, caseMode);
  } else {
    if (!inputText.trim()) {
      showAlert("Masukkan teks yang ingin dienkripsi!", "danger");
      return;
    }
    result = await aes256Encrypt(inputText, key, caseMode);
  }

  document.getElementById("resultTextarea").value = result;
}

// Inisialisasi (opsional, bisa dipanggil dari halaman jika perlu)
document.addEventListener("DOMContentLoaded", function () {
  // Bisa tambahkan event listener tambahan jika diperlukan
  // Contoh: auto-process saat input berubah (opsional, karena AES lambat)
  // document.getElementById("inputTextarea")?.addEventListener("input", processAES);
});
