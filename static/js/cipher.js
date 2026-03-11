/**
 * Script Cipher Lainnya (Caesar, Morse, Atbash, Vigenere)
 * Tidak termasuk AES-256 dan Change Case
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
// UI Helpers (umum untuk cipher klasik)
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

function clearForm() {
  document.getElementById("inputTextarea").value = "";
  document.getElementById("resultTextarea").value = "";

  // Reset default values
  const shiftInput = document.getElementById("shift");
  if (shiftInput) shiftInput.value = 7;

  const modeEncrypt = document.getElementById("modeEncrypt");
  if (modeEncrypt) modeEncrypt.checked = true;

  const vigenereKey = document.getElementById("vigenereKey");
  if (vigenereKey) vigenereKey.value = "KUNCI";

  // Reset visual alphabet (Caesar)
  const alphabetBox = document.getElementById("alphabetBox");
  if (alphabetBox) alphabetBox.innerHTML = "Pilih shift untuk melihat";
}

// ======================
// Core Processing Logic
// ======================
function processCipher() {
  const inputText = document.getElementById("inputTextarea").value;
  const cipherType = document.getElementById("cipherType").value;
  const mode =
    document.querySelector('input[name="mode"]:checked')?.value || "encrypt";
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
      // Update visual alphabet
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
  }

  document.getElementById("resultTextarea").value = result;
}

// ======================
// Event Listeners & Initialization
// ======================
document.addEventListener("DOMContentLoaded", function () {
  const inputEl = document.getElementById("inputTextarea");
  const cipherTypeEl = document.getElementById("cipherType");
  const shiftEl = document.getElementById("shift");
  const modeEls = document.querySelectorAll('input[name="mode"]');

  // Auto-process saat input berubah (kecuali AES)
  if (inputEl) {
    inputEl.addEventListener("input", () => {
      if (cipherTypeEl?.value !== "aes256") processCipher();
    });
  }

  // Ganti jenis cipher → update settings & proses ulang
  if (cipherTypeEl) {
    cipherTypeEl.addEventListener("change", () => {
      updateSettings();
      if (inputEl?.value.trim()) processCipher();
    });
  }

  // Shift berubah → update visual & proses
  if (shiftEl) {
    shiftEl.addEventListener("input", function () {
      const val = parseInt(this.value);
      if (isNaN(val) || val < 0 || val > 25) {
        this.classList.add("is-invalid");
      } else {
        this.classList.remove("is-invalid");
        if (cipherTypeEl?.value === "caesar") processCipher();
      }
    });
  }

  // Mode encrypt/decrypt berubah
  modeEls.forEach((el) => {
    el.addEventListener("change", () => {
      if (cipherTypeEl?.value !== "aes256") processCipher();
    });
  });

  // Inisialisasi tampilan settings awal
  if (cipherTypeEl) updateSettings();
});

// ======================
// Show/Hide Settings Panels
// ======================
function updateSettings() {
  const cipherType = document.getElementById("cipherType")?.value;

  const panels = {
    caesarSettings: document.getElementById("caesarSettings"),
    morseSettings: document.getElementById("morseSettings"),
    atbashSettings: document.getElementById("atbashSettings"),
    vigenereSettings: document.getElementById("vigenereSettings"),
    // aesSettings: document.getElementById("aesSettings") // tidak di halaman ini
  };

  // Sembunyikan semua dulu
  Object.values(panels).forEach((panel) => {
    if (panel) panel.style.display = "none";
  });

  // Tampilkan yang sesuai
  if (cipherType && panels[`${cipherType}Settings`]) {
    panels[`${cipherType}Settings`].style.display = "block";
  }
}
