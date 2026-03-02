/**
 * Cipher Functions in JavaScript
 * Includes: Caesar, Morse, Atbash, Vigenere, AES-256
 */

// ======================
// Caesar Cipher
// ======================
function caesar(
  text,
  shift,
  encrypt = true,
  caseMode = "maintain",
  foreign = "include",
) {
  let result = "";
  let shiftVal = encrypt ? shift : (26 - shift) % 26;

  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    let code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      // A-Z
      let newCode = ((code - 65 + shiftVal) % 26) + 65;
      result += String.fromCharCode(newCode);
    } else if (code >= 97 && code <= 122) {
      // a-z
      let newCode = ((code - 97 + shiftVal) % 26) + 97;
      result += String.fromCharCode(newCode);
    } else {
      if (foreign === "include") {
        result += char;
      }
    }
  }

  if (caseMode === "upper") return result.toUpperCase();
  if (caseMode === "lower") return result.toLowerCase();
  return result;
}

// ======================
// Morse Code
// ======================
const morseMap = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
  " ": "/",
};

const morseMapReverse = Object.fromEntries(
  Object.entries(morseMap).map(([k, v]) => [v, k]),
);

function morseEncode(text, letterSep = " ", wordSep = "/") {
  text = text.toUpperCase();
  let result = [];

  for (let char of text) {
    if (char === " ") {
      result.push(wordSep);
    } else if (morseMap[char]) {
      result.push(morseMap[char] + letterSep);
    }
  }

  return result.join("").trim();
}

function morseDecode(morseText, letterSep = " ", wordSep = "/") {
  let words = morseText.split(wordSep);
  let result = [];

  for (let word of words) {
    let letters = word.split(letterSep);
    let wordText = "";
    for (let code of letters) {
      code = code.trim();
      if (code !== "" && morseMapReverse[code]) {
        wordText += morseMapReverse[code];
      }
    }
    result.push(wordText);
  }

  return result.join(" ");
}

// ======================
// Atbash Cipher
// ======================
function atbash(text, caseMode = "maintain", foreign = "include") {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    let code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(155 - code);
    } else if (code >= 97 && code <= 122) {
      result += String.fromCharCode(219 - code);
    } else {
      if (foreign === "include") {
        result += char;
      }
    }
  }

  if (caseMode === "upper") return result.toUpperCase();
  if (caseMode === "lower") return result.toLowerCase();
  return result;
}

// ======================
// Vigenère Cipher
// ======================
function vigenere(
  text,
  key,
  encrypt = true,
  caseMode = "maintain",
  foreign = "include",
) {
  let result = "";
  key = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!key) key = "A";

  let keyLength = key.length;
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    let code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      let shift = key.charCodeAt(keyIndex % keyLength) - 65;
      let base = 65;
      let newCode = encrypt
        ? ((code - base + shift) % 26) + base
        : ((code - base - shift + 26) % 26) + base;
      result += String.fromCharCode(newCode);
      keyIndex++;
    } else if (code >= 97 && code <= 122) {
      let shift = key.charCodeAt(keyIndex % keyLength) - 65;
      let base = 97;
      let newCode = encrypt
        ? ((code - base + shift) % 26) + base
        : ((code - base - shift + 26) % 26) + base;
      result += String.fromCharCode(newCode);
      keyIndex++;
    } else {
      if (foreign === "include") {
        result += char;
      }
    }
  }

  if (caseMode === "upper") return result.toUpperCase();
  if (caseMode === "lower") return result.toLowerCase();
  return result;
}

// ======================
// AES-256 (Web Crypto API)
// ======================
async function aes256Encrypt(text, passphrase, caseMode = "maintain") {
  if (!passphrase) return "Kunci tidak boleh kosong!";

  try {
    // Generate key from passphrase using SHA-256
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(passphrase),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"],
    );

    // Use a fixed salt for consistency (in production, should be stored)
    const salt = new TextEncoder().encode("apkenkripsi-salt");

    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      new TextEncoder().encode(text),
    );

    // Combine IV + encrypted data and encode to base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    let result = btoa(String.fromCharCode(...combined));
    if (caseMode === "upper") return result.toUpperCase();
    if (caseMode === "lower") return result.toLowerCase();
    return result;
  } catch (e) {
    return "Enkripsi gagal: " + e.message;
  }
}

async function aes256Decrypt(ciphertext, passphrase, caseMode = "maintain") {
  if (!passphrase) return "Kunci tidak boleh kosong!";

  try {
    // Decode from base64
    const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

    // Extract IV (12 bytes) and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Generate key from passphrase
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

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encrypted,
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    return "Dekripsi gagal! Kunci salah atau data rusak.";
  }
}

// ======================
// Generate Caesar Alphabet Map
// ======================
function generateCaesarMap(shift) {
  const plain = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let cipher = "";
  for (let i = 0; i < 26; i++) {
    let newCode = ((i + shift) % 26) + 65;
    cipher += String.fromCharCode(newCode);
  }
  return `${plain}<br>↓<br>${cipher}`;
}

// ======================
// UI Functions
// ======================

// Copy to clipboard
function copyToClipboard(elementId) {
  const textarea = document.getElementById(elementId);
  const text = textarea.value.trim();

  if (!text) {
    showAlert("Tidak ada teks untuk disalin!", "danger");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      showAlert("Berhasil disalin ke clipboard!", "success");
    })
    .catch((err) => {
      console.error("Gagal:", err);
      showAlert("Gagal menyalin teks.", "danger");
    });
}

// Show alert
function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    <strong>${type === "success" ? "Berhasil!" : type === "danger" ? "Error!" : "Peringatan!"}</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  const container = document.querySelector(".container");
  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// Clear form
function clearForm() {
  document.getElementById("inputTextarea").value = "";
  document.getElementById("resultTextarea").value = "";

  const shiftInput = document.getElementById("shift");
  if (shiftInput) shiftInput.value = 7;

  const modeEncrypt = document.getElementById("modeEncrypt");
  if (modeEncrypt) modeEncrypt.checked = true;

  const vigenereKey = document.getElementById("vigenereKey");
  if (vigenereKey) vigenereKey.value = "KUNCI";

  const aesKey = document.getElementById("aesKey");
  if (aesKey) aesKey.value = "";

  // Reset alphabet map
  const alphabetBox = document.getElementById("alphabetBox");
  if (alphabetBox) alphabetBox.innerHTML = "Pilih shift untuk melihat";
}

// Process AES (async)
async function processAES() {
  const inputText = document.getElementById("inputTextarea").value;
  const key = document.getElementById("aesKey").value;
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const caseMode = document.getElementById("caseMode")?.value || "maintain";

  if (!key) {
    showAlert("Masukkan kunci/password!", "danger");
    return;
  }

  let result;
  if (mode === "encrypt") {
    if (!inputText.trim()) {
      showAlert("Masukkan teks yang ingin dienkripsi!", "danger");
      return;
    }
    result = await aes256Encrypt(inputText, key, caseMode);
  } else {
    if (!inputText.trim()) {
      showAlert("Masukkan teks yang ingin didekripsi!", "danger");
      return;
    }
    result = await aes256Decrypt(inputText, key, caseMode);
  }

  document.getElementById("resultTextarea").value = result;
}

// Process other ciphers
function processCipher() {
  const inputText = document.getElementById("inputTextarea").value;
  const cipherType = document.getElementById("cipherType").value;
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const caseMode = document.getElementById("caseMode")?.value || "maintain";
  const foreign = document.getElementById("foreign")?.value || "include";

  if (!inputText.trim() && cipherType !== "atbash") {
    showAlert("Masukkan teks untuk dienkripsi/didekripsi!", "danger");
    return;
  }

  let result = "";

  switch (cipherType) {
    case "caesar":
      const shift = parseInt(document.getElementById("shift").value) || 7;
      if (shift < 0 || shift > 25) {
        showAlert("Nilai shift harus antara 0 sampai 25!", "danger");
        return;
      }
      result = caesar(inputText, shift, mode === "encrypt", caseMode, foreign);
      // Update alphabet visual
      document.getElementById("alphabetBox").innerHTML =
        generateCaesarMap(shift);
      break;

    case "morse":
      const letterSep = document.getElementById("morseLetterSep")?.value || " ";
      const wordSep = document.getElementById("morseWordSep")?.value || "/";
      if (mode === "encrypt") {
        result = morseEncode(inputText, letterSep, wordSep);
      } else {
        result = morseDecode(inputText, letterSep, wordSep);
      }
      break;

    case "atbash":
      result = atbash(inputText, caseMode, foreign);
      break;

    case "vigenere":
      const vigenereKey =
        document.getElementById("vigenereKey").value.trim() || "KUNCI";
      if (!vigenereKey) {
        showAlert("Masukkan kata kunci!", "danger");
        return;
      }
      result = vigenere(
        inputText,
        vigenereKey,
        mode === "encrypt",
        caseMode,
        foreign,
      );
      break;

    case "aes256":
      processAES();
      return;
  }

  document.getElementById("resultTextarea").value = result;
}

// Show/hide settings based on cipher type
function updateSettings() {
  const cipherType = document.getElementById("cipherType").value;

  // Get all settings elements with null check
  const caesarSettings = document.getElementById("caesarSettings");
  const morseSettings = document.getElementById("morseSettings");
  const atbashSettings = document.getElementById("atbashSettings");
  const vigenereSettings = document.getElementById("vigenereSettings");
  const aesSettings = document.getElementById("aesSettings");

  // Hide all settings first
  if (caesarSettings) caesarSettings.style.display = "none";
  if (morseSettings) morseSettings.style.display = "none";
  if (atbashSettings) atbashSettings.style.display = "none";
  if (vigenereSettings) vigenereSettings.style.display = "none";
  if (aesSettings) aesSettings.style.display = "none";

  // Show relevant settings
  switch (cipherType) {
    case "caesar":
      if (caesarSettings) caesarSettings.style.display = "block";
      break;
    case "morse":
      if (morseSettings) morseSettings.style.display = "block";
      break;
    case "atbash":
      if (atbashSettings) atbashSettings.style.display = "block";
      break;
    case "vigenere":
      if (vigenereSettings) vigenereSettings.style.display = "block";
      break;
    case "aes256":
      if (aesSettings) aesSettings.style.display = "block";
      break;
  }
}

// Initialize event listeners when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners for real-time updates
  const inputEl = document.getElementById("inputTextarea");
  const cipherTypeEl = document.getElementById("cipherType");
  const shiftEl = document.getElementById("shift");
  const modeEls = document.querySelectorAll('input[name="mode"]');

  if (inputEl) {
    inputEl.addEventListener("input", function () {
      // Only auto-process for non-AES ciphers
      const cipherType = cipherTypeEl?.value;
      if (cipherType && cipherType !== "aes256") {
        processCipher();
      }
    });
  }

  if (cipherTypeEl) {
    cipherTypeEl.addEventListener("change", function () {
      updateSettings();
      const inputText = document.getElementById("inputTextarea")?.value;
      if (this.value !== "aes256" && inputText?.trim()) {
        processCipher();
      }
    });
  }

  if (shiftEl) {
    shiftEl.addEventListener("input", function () {
      const val = parseInt(this.value);
      if (isNaN(val) || val < 0 || val > 25) {
        this.classList.add("is-invalid");
      } else {
        this.classList.remove("is-invalid");
        if (cipherTypeEl?.value === "caesar") {
          processCipher();
        }
      }
    });
  }

  modeEls.forEach((el) => {
    el.addEventListener("change", function () {
      const cipherType = cipherTypeEl?.value;
      if (cipherType && cipherType !== "aes256") {
        processCipher();
      }
    });
  });

  // Initialize settings visibility
  if (cipherTypeEl) {
    updateSettings();
  }
});

// Project Carousel Infinite Scroll
const carousel = document.querySelector(".projects-carousel");

// Clone semua anak dan tambahkan ke akhir
const cards = carousel.innerHTML;
carousel.innerHTML += cards; // duplikat sekali

// Optional: clone lagi kalau mau lebih panjang loop
// carousel.innerHTML += cards;

// Pause on hover (sudah ada di CSS, tapi bisa ditambah logika JS kalau perlu)
carousel.addEventListener("mouseenter", () => {
  carousel.style.animationPlayState = "paused";
});
carousel.addEventListener("mouseleave", () => {
  carousel.style.animationPlayState = "running";
});

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
      area.value = val.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
      break;
    case "title":
      area.value = val
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
      break;
    case "inverse":
      area.value = val
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
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
