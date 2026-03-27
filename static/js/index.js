// Ambil semua elemen navigasi
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    // 1. Hapus status aktif (warna cyan & garis bawah) dari semua menu
    navLinks.forEach((item) => {
      item.classList.remove("text-cyan-400", "border-b-2", "border-cyan-400");
      item.classList.add("text-slate-300");
    });

    // 2. Tambahkan status aktif ke menu yang baru saja diklik
    this.classList.add("text-cyan-400", "border-b-2", "border-cyan-400");
    this.classList.remove("text-slate-300");
  });
});

// 1. Data Asli Proyek (Sesuai dengan kode asli)
// 1. Data Asli Proyek (Sekarang dengan spesifik IMAGE)
const projectData = [
  {
    title: "AES-256 Enkripsi",
    icon: "enhanced_encryption",
    href: "/encode-decode",
    category: "Web Application",
    desc: "Enkripsi & dekripsi teks menggunakan AES-256 + Web Crypto API",
    image: "/static/images/aes.jpg",
    gallery: ["/static/images/aes.jpg", "/static/images/aes-detail1.png"],
    developer: "Muhamad Hilal Diyaul Haq",
    problem:
      "Pesan teks biasa yang dikirim melalui internet sangat rentan disadap atau dibaca oleh pihak ketiga.",
    solution:
      "Menyediakan alat enkripsi berstandar militer (AES-256) yang beroperasi sepenuhnya di sisi klien, sehingga privasi data terjamin aman.",
  },
  {
    title: "Cipher Tools",
    icon: "password",
    href: "/cipher",
    category: "Web Application",
    desc: "Caesar, Morse, Atbash, Vigenère — alat kripto klasik untuk pembelajaran keamanan data.",
    image: "/static/images/cipher.jpg",
    gallery: ["/static/images/cipher.jpg", "/static/images/cipher-detail1.png"],
    developer: "Muhamad Hilal Diyaul Haq",
    problem:
      "Mempelajari dasar-dasar kriptografi klasik seringkali membingungkan jika dilakukan secara manual tanpa alat peraga interaktif.",
    solution:
      "Membangun platform edukasi interaktif yang memungkinkan pengguna melihat proses enkripsi sandi klasik secara langsung.",
  },
  {
    title: "Case Converter",
    icon: "text_format",
    href: "/caseconverter",
    category: "Web Application",
    desc: "Ubah format teks dengan cepat: Uppercase, Lowercase, Title Case, dan Alternating Case.",
    image: "/static/images/case.jpg",
    gallery: ["/static/images/case.jpg", "/static/images/case-detail1.png"],
    developer: "Rikaz Putra Erdiansyah",
    problem:
      "Seringkali kita perlu mengubah format huruf secara massal (misal kapital semua), dan mengetik ulang memakan banyak waktu.",
    solution:
      "Alat konversi instan 1-klik yang memformat teks secara otomatis dengan berbagai gaya penulisan.",
  },
  {
    title: "TTS & STT",
    icon: "mic",
    href: "/tts-stt",
    category: "Web Application",
    desc: "Text to Speech & Speech to Text — Mendukung multibahasa & fitur rekam suara langsung dari browser.",
    image: "/static/images/tts.jpg",
    developer: "Ihsan Fathurrahman",
    gallery: ["/static/images/tts.jpg", "/static/images/tts-detail1.png"],
    problem:
      "Mengubah teks ke suara atau sebaliknya secara manual itu ribet dan butuh aplikasi tambahan.",
    solution:
      "Fitur Text to Speech & Speech to Text langsung di browser tanpa install aplikasi tambahan, praktis dan cepat.",
  },
  {
    title: "Image to Base64",
    icon: "image",
    href: "/imagetobase64",
    category: "Web Application",
    desc: "Konversi gambar ke format Base64 — mempermudah proses upload, preview & salin kode untuk developer.",
    image: "/static/images/base.jpg",
    gallery: ["/static/images/base.jpg", "/static/images/base-detail1.png"],
    developer: "Muhamad Hilal Diyaul Haq",
    problem:
      "Developer sering butuh encode gambar ke Base64 untuk embedding, tapi proses manual cukup merepotkan.",
    solution:
      "Konversi otomatis gambar ke Base64 hanya dengan upload, siap copy tanpa ribet.",
  },
  {
    title: "Todolist",
    icon: "checklist",
    href: "/todo",
    category: "Web Application",
    desc: "Aplikasi produktivitas sederhana untuk membuat dan melacak daftar tugas harianmu dengan mudah.",
    image: "/static/images/todo.jpg",
    gallery: ["/static/images/todo.jpg", "/static/images/todo-detail1.png"],
    developer: "Muhamad Hilal Diyaul Haq",
    problem:
      "Sering lupa tugas harian karena tidak ada sistem pencatatan yang rapi.",
    solution:
      "Aplikasi sederhana untuk mencatat dan memantau tugas agar lebih terorganisir.",
  },
  {
    title: "Quiz Game",
    icon: "sports_esports",
    href: "/quiz",
    category: "Web Application",
    desc: "Latih pengetahuan kamu dengan berbagai soal kuis interaktif yang menantang.",
    image: "/static/images/quiz.jpg",
    gallery: ["/static/images/quiz.jpg", "/static/images/quiz-detail1.png"],
    developer: "Muhamad Hilal Diyaul Haq",
    problem:
      "Belajar terasa membosankan tanpa adanya interaksi atau tantangan.",
    solution:
      "Game kuis interaktif yang membuat proses belajar jadi lebih seru dan menantang.",
  },
  {
    title: "AniManga Ranking",
    icon: "leaderboard",
    href: "/utamaranking",
    category: "Web Application",
    desc: "Cek peringkat anime & manga terbaru secara real-time terintegrasi dengan API MyAnimeList.",
    image: "/static/images/ranking.jpg",
    gallery: [
      "/static/images/ranking.jpg",
      "/static/images/ranking-detail1.png",
    ],
    developer: "Ihsan Fathurrahman",
    problem:
      "Sulit mencari referensi anime atau manga terbaik yang sedang trending.",
    solution:
      "Menampilkan ranking terbaru dari API secara real-time untuk membantu memilih tontonan.",
  },
  {
    title: "Anime Schedule",
    icon: "calendar_month",
    href: "/anischedule",
    category: "Web Application",
    desc: "Lihat jadwal tayang anime terbaru secara akurat agar tidak ketinggalan episode.",
    image: "/static/images/schedule.jpg",
    gallery: [
      "/static/images/schedule.jpg",
      "/static/images/schedule-detail1.png",
    ],
    developer: "Ihsan Fathurrahman",
    problem:
      "Sering ketinggalan episode anime karena tidak tahu jadwal rilisnya.",
    solution:
      "Jadwal tayang anime terbaru yang update sehingga kamu tidak ketinggalan episode.",
  },
  {
    title: "Jurnal PKL",
    icon: "book",
    href: "/jurnal",
    category: "Web Application",
    desc: "Sistem informasi pencatatan kegiatan harian selama praktik kerja lapangan berbasis web.",
    image: "/static/images/icon-192.png",
    gallery: ["/static/images/jurnalpwa.png"],
    developer: "Muhamad Hilal Diyaul Haq",
    problem:
      "Pencatatan kegiatan PKL masih manual dan rawan hilang atau tidak rapi.",
    solution:
      "Sistem digital untuk mencatat aktivitas harian secara terstruktur dan aman.",
  },
  {
    title: "Wedding Invitation",
    icon: "favorite",
    href: "/wedding",
    category: "Web Application",
    desc: "Template website undangan pernikahan digital yang unik, modern, dan menarik.",
    image: "/static/images/wedding.jpg",
    gallery: [
      "/static/images/wedding.jpg",
      "/static/images/wedding-detail1.png",
    ],
    developer: "Rikaz Putra Ediansyah",
    problem:
      "Undangan fisik memakan biaya besar dan kurang praktis untuk dibagikan.",
    solution:
      "Website undangan digital yang hemat biaya, mudah dibagikan, dan terlihat modern.",
  },
  {
    title: "PDF Merge & Split",
    icon: "picture_as_pdf",
    href: "/utamapdf",
    category: "Web Application",
    desc: "Aplikasi web ultilitas untuk menggabungkan dan memisahkan halaman file PDF dengan cepat.",
    image: "/static/images/PDF.jpg",
    gallery: ["/static/images/PDF.jpg", "/static/images/PDF-detail1.png"],
    developer: "Muhamad Hilal Diyaul Haq",
    problem:
      "Menggabungkan atau memisahkan file PDF biasanya butuh software khusus.",
    solution:
      "Tool online yang bisa merge dan split PDF langsung tanpa install aplikasi.",
  },
  {
    title: "Jurnal PKL APK",
    icon: "smartphone",
    category: "Mobile Application",
    href: "https://drive.google.com/uc?export=download&id=1L49eaZmkc0dXG4Q5Y3yt-62I68RYo9wO",
    desc: "Aplikasi Android yang membantu pengguna mencatat kegiatan harian secara digital dari smartphone.",
    image: "/static/images/jurnalapp.jpg",
    gallery: [
      "/static/images/jurnalapp.jpg",
      "/static/images/jurnalapp-detail.jpeg",
    ],
    developer: "Muhamad Hilal Diyaul Haq",
    problem:
      "Mencatat kegiatan lewat buku atau web kurang fleksibel saat mobile.",
    solution:
      "Aplikasi Android untuk mencatat kegiatan kapan saja langsung dari smartphone.",
  },
  {
    title: "What Should I Cook?",
    icon: "restaurant",
    href: "/resep-index",
    category: "Web Application",
    desc: "Website pencari ide masakan cerdas berdasarkan bahan-bahan yang saat ini kamu miliki di dapur.",
    image: "/static/images/recipe.jpg",
    gallery: ["/static/images/recipe.jpg", "/static/images/recipe-detail1.png"],
    developer: "Ihsan Fathurrahman",
    problem: "Sering bingung mau masak apa dengan bahan yang tersedia.",
    solution:
      "Rekomendasi masakan berdasarkan bahan yang dimiliki agar tidak perlu berpikir lama.",
  },
  {
    title: "Universal Converter",
    icon: "sync",
    href: "/unitconverter",
    category: "Web Application",
    desc: "Berbagai alat konversi seperti panjang, berat, suhu, dan waktu dalam satu tempat praktis.",
    image: "/static/images/converter.jpg",
    gallery: [
      "/static/images/converter.jpg",
      "/static/images/converter-detail1.png",
    ],
    developer: "Muhamad Hilal Diyaul Haq",
    problem: "Konversi satuan harus cari tool berbeda-beda dan tidak praktis.",
    solution:
      "Semua jenis konversi dalam satu tempat agar lebih cepat dan efisien.",
  },
  {
    title: "Currency Converter",
    icon: "currency_exchange",
    href: "/currencyconverter",
    category: "Web Application",
    desc: "Konversi nilai mata uang dunia menggunakan nilai tukar terbaru yang update secara real-time.",
    image: "/static/images/money.jpg",
    gallery: ["/static/images/money.jpg", "/static/images/money-detail1.png"],
    developer: "Muhamad Hilal Diyaul Haq",
    problem: "Nilai tukar mata uang berubah-ubah dan sulit dihitung manual.",
    solution:
      "Konversi mata uang real-time dengan data terbaru secara otomatis.",
  },
  {
    title: "Cuaca Hari Ini",
    icon: "partly_cloudy_day",
    href: "/weather",
    category: "Web Application",
    desc: "Pantau prakiraan cuaca 24 jam ke depan dengan visualisasi grafik suhu yang interaktif via OpenWeatherMap API.",
    image: "/static/images/cuaca.jpg",
    gallery: ["/static/images/cuaca.jpg", "/static/images/cuaca-detail1.png"],
    developer: "Muhamad Hilal Diyaul Haq",
    problem:
      "Banyak konverter satuan bertebaran di internet, namun seringkali penuh iklan dan UI yang membingungkan.",
    solution:
      "Membuat konverter satu pintu dengan antarmuka Glassmorphism yang bersih, cepat, dan responsif.",
  },
];

// 2. Render Grid Proyek Otomatis
const gridContainer = document.getElementById("project-grid");

projectData.forEach((p, index) => {
  const cardHTML = `
            <div class="group bg-surface-container-low rounded-xl overflow-hidden transition-all duration-500 hover:bg-surface-container-high hover:translate-y-[-8px] border border-white/5 hover:border-cyan-500/30 flex flex-col h-full">
                <div class="h-40 overflow-hidden relative shrink-0">
                    <div class="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent z-10"></div>
                    <img src="${p.image}" class="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" alt="${p.title}">
                    <div class="absolute top-4 left-4 p-3 bg-black/40 backdrop-blur-md rounded-lg z-20 border border-white/10">
                        <span class="material-symbols-outlined text-cyan-400">${p.icon}</span>
                    </div>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="text-xl font-headline font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">${p.title}</h3>
                    <p class="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">${p.desc}</p>
                    <button onclick="openModal(${index})" class="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-cyan-500 hover:border-cyan-500 hover:text-white transition-all font-semibold text-sm flex justify-center items-center gap-2">
                        <span class="material-symbols-outlined text-sm">visibility</span> Detail Proyek
                    </button>
                </div>
            </div>`;
  gridContainer.insertAdjacentHTML("beforeend", cardHTML);
});

// 3. Logika Buka & Tutup Modal
const modal = document.getElementById("projectModal");
const mTitle = document.getElementById("modalTitle");
const mDesc = document.getElementById("modalDesc");
const mIcon = document.getElementById("modalIcon");
const mLink = document.getElementById("modalLink");
const mProblem = document.getElementById("modalProblem");
const mSolution = document.getElementById("modalSolution");
const mDeveloper = document.getElementById("modalDeveloper");
const mCategory = document.getElementById("modalCategory");

// VARIABEL BARU UNTUK SLIDER
const mSliderImage = document.getElementById("modalSliderImage");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const sliderDots = document.getElementById("sliderDots");

let currentGallery = [];
let currentImageIndex = 0;

// FUNGSI UPDATE SLIDER (BARU)
function updateSlider() {
  // Ganti gambar
  mSliderImage.src = currentGallery[currentImageIndex];

  // Tampilkan/Sembunyikan tombol panah kalau gambar cuma 1
  if (currentGallery.length > 1) {
    btnPrev.style.display = "block";
    btnNext.style.display = "block";
  } else {
    btnPrev.style.display = "none";
    btnNext.style.display = "none";
  }

  // Generate titik-titik indikator di bawah gambar
  sliderDots.innerHTML = currentGallery
    .map((_, index) => {
      return `<div class="w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-cyan-400 w-4" : "bg-white/40"}"></div>`;
    })
    .join("");
}

// FUNGSI TOMBOL NEXT & PREV (BARU)
function nextImage() {
  currentImageIndex =
    currentImageIndex === currentGallery.length - 1 ? 0 : currentImageIndex + 1;
  updateSlider();
}

function prevImage() {
  currentImageIndex =
    currentImageIndex === 0 ? currentGallery.length - 1 : currentImageIndex - 1;
  updateSlider();
}

function openModal(index) {
  const data = projectData[index];
  mTitle.innerText = data.title;
  mDesc.innerText = data.desc;
  mIcon.innerText = data.icon;

  // MASUKKAN DATA PROBLEM & SOLUTION DI SINI:
  // Gunakan operator '||' sebagai fallback jika ada data yang belum kamu isi problem/solution-nya
  mProblem.innerText = data.problem || "Deskripsi masalah belum ditambahkan.";
  mSolution.innerText = data.solution || "Deskripsi solusi belum ditambahkan.";
  mDeveloper.innerText = data.developer || "Tim Pengembang";
  mCategory.innerText = data.category || "Kategori Blm Di Settings";

  // Set href sesungguhnya
  mLink.href = data.href;

  // Reset warna dulu (hapus warna sebelumnya)
  mCategory.className =
    "font-label text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-full";

  // Kasih warna sesuai kategori
  if (data.category === "Mobile Application") {
    mCategory.classList.add("text-green-400", "bg-green-400/10");
  } else if (data.category === "Web Application") {
    mCategory.classList.add("text-cyan-400", "bg-cyan-400/10");
  } else {
    // Warna default kalau kategori lain
    mCategory.classList.add("text-orange-400", "bg-orange-400/10");
  }

  // LOGIKA SLIDER: Set gallery dan reset index ke 0
  // Fallback: Jika 'gallery' tidak diisi, gunakan 'image' utama saja
  currentGallery =
    data.gallery && data.gallery.length > 0 ? data.gallery : [data.image];
  currentImageIndex = 0;
  updateSlider(); // Panggil fungsi untuk render gambar

  // Tampilkan Modal
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden"; // Cegah scroll background
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "auto"; // Kembalikan scroll
}

// TS Partikles
// Memuat efek partikel di background Hero Section
tsParticles.load("tsparticles", {
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "grab", // Mode "grab" bikin garis nyambung ke kursor. Bisa diganti "repel" kalau mau partikelnya kabur.
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 150,
        links: {
          opacity: 0.5,
        },
      },
    },
  },
  particles: {
    color: {
      value: ["#22d3ee", "#a855f7", "#ffffff"], // Warna partikel: Cyan, Purple, White (Sesuai tema Abang)
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.1, // Garisnya dibuat agak transparan biar teks tetap terbaca
      width: 1,
    },
    move: {
      enable: true,
      speed: 1.5, // Kecepatan gerak partikel
      direction: "none",
      random: false,
      straight: false,
      outModes: {
        default: "bounce", // Mantul kalau kena ujung layar
      },
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 60, // Jumlah partikel
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
});
