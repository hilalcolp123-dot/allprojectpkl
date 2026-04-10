// ==========================================
// OPTIMASI PERFORMA: Auto-Pause Animasi untuk SEMUA Section
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil semua elemen <section> yang ada di HTML (home, team, tech-stack, dll)
  const allSections = document.querySelectorAll("section");

  // 2. Buat satu Observer untuk memantau semuanya sekaligus
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // JIKA SECTION MASUK KE LAYAR: Hapus efek pause (Semua animasi di dalamnya bergerak)
          entry.target.classList.remove("pause-animation");
        } else {
          // JIKA SECTION KELUAR DARI LAYAR: Tambahkan efek pause (Semua animasi di dalamnya membeku)
          entry.target.classList.add("pause-animation");
        }
      });
    },
    {
      // Angka 0.05 berarti kode akan terpicu jika minimal 5% bagian section terlihat di layar
      threshold: 0.05,
    },
  );

  // 3. Pasang observer ke masing-masing section
  allSections.forEach((section) => {
    observer.observe(section);
  });
});

// ==========================================
// EFEK MOUSE TRAIL (OPTIMIZED WITH OBJECT POOLING)
// ==========================================
const bubblePool = [];
const maxBubbles = 15; // Jumlah maksimal gelembung yang aktif di layar
let lastBubbleTime = 0;
let currentBubbleIdx = 0;

// 1. Inisialisasi: Buat elemen di awal dan simpan dalam array (Pool)
for (let i = 0; i < maxBubbles; i++) {
  const b = document.createElement("div");
  b.className = "mouse-bubble";
  b.style.display = "none"; // Sembunyikan di awal
  b.style.position = "absolute"; // Pastikan absolut
  b.style.pointerEvents = "none"; // Agar tidak mengganggu klik mouse
  document.body.appendChild(b);
  bubblePool.push(b);
}

document.addEventListener("mousemove", (e) => {
  const now = Date.now();
  // Batasi pembuatan gelembung (Throttle)
  if (now - lastBubbleTime < 80) return;
  lastBubbleTime = now;

  // 2. Ambil elemen dari pool (daripada create baru)
  const bubble = bubblePool[currentBubbleIdx];

  // 3. Atur ulang properti gelembung
  const size = Math.random() * 10 + 5;
  const offsetX = (Math.random() - 0.5) * 20;

  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${e.pageX + offsetX}px`;
  bubble.style.top = `${e.pageY}px`;

  // Tampilkan dan jalankan ulang animasi
  bubble.style.display = "block";

  // Trick untuk me-restart animasi CSS:
  bubble.style.animation = "none";
  bubble.offsetHeight; // trigger reflow
  bubble.style.animation = null;

  // 4. Sembunyikan kembali setelah 1 detik (tanpa menghapus dari DOM)
  setTimeout(() => {
    bubble.style.display = "none";
  }, 1000);

  // Pindah ke index berikutnya dalam pool (looping balik ke 0 jika sudah mencapai max)
  currentBubbleIdx = (currentBubbleIdx + 1) % maxBubbles;
});

// ==========================================
// PRELOADER LOGIC: Hilangkan saat halaman selesai loading
// ==========================================
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  if (preloader) {
    // 1. Tambahkan sedikit jeda agar animasi loading sempat terlihat (opsional)
    setTimeout(() => {
      // 2. Transisi mulus memudarkan preloader
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";

      // 3. Hapus preloader dari DOM sepenuhnya agar tidak mengganggu performa dan klik
      setTimeout(() => {
        preloader.style.display = "none";
      }, 800); // 800ms sama dengan durasi transition opacity di CSS
    }, 500); // Jeda 0.5 detik
  }
});

// ==========================================
// GSAP STORYTELLING Section TEAM
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // --- ANIMASI KARTU TIM YANG BARU (LEBIH SIMPEL & ELEGAN) ---
  const teamCards = document.querySelectorAll("#team-grid .floating-card");

  gsap.from(teamCards, {
    scrollTrigger: {
      trigger: "#team-grid",
      start: "top 85%", // Mulai sedikit lebih cepat saat grid terlihat
      toggleActions: "play none none none",
    },
    y: 30, // Hanya sedikit bergerak dari bawah (30px)
    opacity: 0, // Mulai dari transparan (tidak kelihatan)
    duration: 1, // Durasi 1 detik agar mulus
    ease: "power2.out", // Pengereman halus di akhir
    stagger: 0.2, // Muncul satu per satu dengan jeda 0.2 detik
  });

  // 1. Buat Timeline dengan Infinite Loop (repeat: -1)
  const tl = gsap.timeline({
    repeat: -1, // -1 artinya loop terus-menerus tanpa henti
    repeatDelay: 2, // Beri jeda 2 detik sebelum cerita ngulang lagi dari awal
    scrollTrigger: {
      trigger: "#team",
      start: "top 60%", // Animasi mulai saat bagian atas section #team masuk 60% layar
      end: "bottom 10%", // Batas akhir section, animasi dijeda kalau melewati ini

      // PENTING UNTUK PERFORMA: play, pause, resume, pause
      // - Saat masuk dari atas: PLAY
      // - Saat scroll kelewatan ke bawah: PAUSE (Biar gak berat)
      // - Saat scroll naik lagi ke section ini: RESUME
      // - Saat scroll lewat ke atas: PAUSE
      toggleActions: "play pause resume pause",
    },
  });

  // --- MULAI BACA SKENARIO ---

  // PERSIAPAN LOOP: Kembalikan posisi awal mereka di luar layar kiri agar loopnya mulus
  tl.set("#gsap-sub", { x: "-50vw", scaleX: 1 })
    .set("#gsap-shark", { x: "-50vw", scaleX: 1 })

    // Adegan 1: Kapal selam masuk dari kiri ke tengah
    .to("#gsap-sub", {
      x: "40vw",
      duration: 3,
      ease: "power2.out",
    })

    // Adegan 2: Kapal selam diam, nengok kiri
    .to("#gsap-sub", { scaleX: -1, duration: 0.3 }, "+=0.5")

    // Adegan 3: Kapal selam nengok kanan
    .to("#gsap-sub", { scaleX: 1, duration: 0.3 }, "+=0.8")

    // Adegan 4: Kapal selam kabur ke kanan layar SEBELUM hiu datang
    .to(
      "#gsap-sub",
      {
        x: "150vw",
        duration: 1.5,
        ease: "power2.in",
      },
      "+=0.5",
    )

    // Adegan 5: Hiu masuk dari kiri ke tengah layar mencari kapal selam
    .to(
      "#gsap-shark",
      {
        x: "40vw",
        duration: 2.5,
        ease: "power2.out",
      },
      "-=0.5",
    )

    // Adegan 6: Hiu nengok kiri
    .to("#gsap-shark", { scaleX: -1, duration: 0.3 }, "+=0.5")

    // Adegan 7: Hiu nengok kanan
    .to("#gsap-shark", { scaleX: 1, duration: 0.3 }, "+=0.8")

    // Adegan 8: Hiu mengejar kapal selam ke luar layar kanan
    .to(
      "#gsap-shark",
      {
        x: "150vw",
        duration: 1.5,
        ease: "power2.in",
      },
      "+=0.5",
    )

    // ==========================================
    // --- SKENARIO BALIK ARAH KE KIRI ---
    // ==========================================

    // Adegan 9: Kapal selam putar balik (hadap kiri) dan lari kembali ke tengah layar
    .to("#gsap-sub", { scaleX: -1, duration: 0 }, "+=1")
    .to("#gsap-sub", {
      x: "40vw",
      duration: 2,
      ease: "power2.out",
    })

    // Adegan 10: Kapal selam di tengah, nengok kanan (ngecek hiu), lalu nengok kiri lagi
    .to("#gsap-sub", { scaleX: 1, duration: 0.3 }, "+=0.3")
    .to("#gsap-sub", { scaleX: -1, duration: 0.3 }, "+=0.8")

    // Adegan 11: Kapal selam lanjut lari ke luar layar kiri
    .to(
      "#gsap-sub",
      {
        x: "-50vw",
        duration: 1.5,
        ease: "power2.in",
      },
      "+=0.3",
    )

    // Adegan 12: Hiu putar balik (hadap kiri) dan nyusul ke tengah layar
    .to("#gsap-shark", { scaleX: -1, duration: 0 }, "-=0.5")
    .to(
      "#gsap-shark",
      {
        x: "40vw",
        duration: 2,
        ease: "power2.out",
      },
      "-=0.5",
    )

    // Adegan 13: Hiu tiba di tengah kebingungan, nengok kanan, lalu nengok kiri
    .to("#gsap-shark", { scaleX: 1, duration: 0.3 }, "+=0.5")
    .to("#gsap-shark", { scaleX: -1, duration: 0.3 }, "+=0.8")

    // Adegan 14: Hiu sadar kapal selam ke kiri, langsung ngejar ke luar layar kiri!
    .to(
      "#gsap-shark",
      {
        x: "-50vw",
        duration: 1.5,
        ease: "power2.in",
      },
      "+=0.3",
    );
});
// ==========================================
// LOGIKA MOBILE MENU
// ==========================================
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");
const mobileLinks = document.querySelectorAll(".mobile-link");

let isMenuOpen = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen;

  // Update atribut ARIA untuk aksesibilitas
  mobileMenuBtn.setAttribute("aria-expanded", isMenuOpen);

  if (isMenuOpen) {
    // Buka Menu
    mobileMenu.classList.remove("-translate-y-full", "opacity-0");
    mobileMenu.classList.add("translate-y-0", "opacity-100");
    menuIcon.innerText = "close";
    document.body.style.overflow = "hidden";
  } else {
    // Tutup Menu
    mobileMenu.classList.add("-translate-y-full", "opacity-0");
    mobileMenu.classList.remove("translate-y-0", "opacity-100");
    menuIcon.innerText = "menu";
    document.body.style.overflow = "auto";
  }
}

// Event listener untuk klik tombol menu
mobileMenuBtn.addEventListener("click", toggleMenu);

// Event listener untuk menutup menu otomatis saat link diklik (di HP)
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (isMenuOpen) toggleMenu();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // === SCRIPT ANIMASI GELEMBUNG AKUARIUM ===
  const bubbleCount = 10;
  const bubbleField = document.getElementById("global-bubbles");

  // Pastikan elemen global-bubbles ada di HTML
  if (bubbleField) {
    // Generate gelembung dengan durasi animasi yang diacak
    for (let i = 0; i < bubbleCount; i++) {
      let randNum = Math.floor(Math.random() * 20) + 1;
      let animDur = 2 + 0.5 * randNum;

      let moveEl = document.createElement("div");
      moveEl.setAttribute("class", "bubble-rise");
      moveEl.style.animationDuration = animDur + "s";
      moveEl.style.left = Math.floor(Math.random() * 100) + "vw";
      // moveEl.style.position = "absolute"; -> Ini bisa dihapus karena sudah kita set di CSS .bubble-rise di atas!

      let bubbleEl = document.createElement("div");
      bubbleEl.setAttribute("class", "bubble");

      // Kosongkan textNode untuk gelembung murni via CSS
      moveEl.appendChild(bubbleEl);
      bubbleField.appendChild(moveEl);
    }
  }

  // === SCRIPT NAVIGASI SCROLL KAMU TETAP SAMA DI BAWAH SINI ===
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let currentSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("text-white", "border-b-2", "border-secondary");
      link.classList.add("text-white/60");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.remove("text-white/60");
        link.classList.add("text-white", "border-b-2", "border-secondary");
      }
    });
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
    image: "/static/images/cipher.png",
    gallery: ["/static/images/cipher.png", "/static/images/cipher-detail1.png"],
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
    image: "/static/images/quiz.png",
    gallery: ["/static/images/quiz.png", "/static/images/quiz-detail1.png"],
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
    image: "/static/images/schedule.jpeg",
    gallery: [
      "/static/images/schedule.jpeg",
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
    image: "/static/images/wedding.jpeg",
    gallery: [
      "/static/images/wedding.jpeg",
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
    image: "/static/images/PDF.png",
    gallery: ["/static/images/PDF.png", "/static/images/PDF-detail1.png"],
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
    image: "/static/images/recipe.jpeg",
    gallery: [
      "/static/images/recipe.jpeg",
      "/static/images/recipe-detail1.png",
    ],
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
    image: "/static/images/converter.png",
    gallery: [
      "/static/images/converter.png",
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
  {
    title: "AI Financial Manager",
    icon: "payments",
    href: "/finance",
    category: "Web Application / Fintech",
    desc: "Pantau pengeluaran dan dapatkan saran keuangan berbasis AI secara real-time.",
    image: "/static/images/finance.jpeg",
    gallery: [
      "/static/images/finance.jpeg",
      "/static/images/finance-detail1.png",
    ],
    developer: "Muhamad Hilal Diyaul Haq",
    problem:
      "Banyak orang kesulitan mengelola pengeluaran harian dan bingung bagaimana cara berhemat karena tidak ada arahan yang personal.",
    solution:
      "Membangun manajer keuangan pintar yang tidak hanya mencatat transaksi, tapi juga memberikan analisis instan menggunakan AI untuk membantu pengambilan keputusan finansial.",
  },
];

// 2. Render Grid Proyek Otomatis
const gridContainer = document.getElementById("project-grid");

// Render Card Project (Gaya Card diubah jadi Glassmorphism Gelap)
projectData.forEach((p, index) => {
  const cardHTML = `
            <div class="group bg-secondary/5 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_15px_40px_rgba(247,247,255,0.05)] hover:translate-y-[-8px] border border-secondary/10 hover:border-secondary/30 flex flex-col h-full">
                <div class="h-40 overflow-hidden relative shrink-0">
                    <div class="absolute inset-0 bg-gradient-to-t from-primary to-transparent z-10"></div>
                    <img src="${p.image}" class="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" alt="${p.title}">
                    <div class="absolute top-4 left-4 p-3 bg-primary/80 backdrop-blur-md rounded-lg z-20 border border-secondary/20 shadow-sm">
                        <span class="material-symbols-outlined text-secondary">${p.icon}</span>
                    </div>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="text-xl font-headline font-bold mb-2 text-white group-hover:text-secondary transition-colors">${p.title}</h3>
                    <p class="text-white/70 text-sm mb-6 line-clamp-2 flex-grow">${p.desc}</p>
                    <button onclick="openModal(${index})" class="w-full py-2.5 rounded-lg bg-secondary/10 border border-secondary/20 text-white hover:bg-secondary hover:text-primary transition-all font-bold text-sm flex justify-center items-center gap-2 shadow-sm">
                        <span class="material-symbols-outlined text-sm">visibility</span> Detail Proyek
                    </button>
                </div>
            </div>`;
  gridContainer.insertAdjacentHTML("beforeend", cardHTML);
});

// 3. Logika Buka & Tutup Modal
const modal = document.getElementById("projectModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContentBox = document.getElementById("modalContentBox");
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

// FUNGSI UPDATE SLIDER
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
      return `<div class="w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-secondary w-4" : "bg-white/30"}"></div>`;
    })
    .join("");
}

// FUNGSI TOMBOL NEXT & PREV
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

// FUNGSI BUKA MODAL DENGAN ANIMASI
function openModal(index) {
  const data = projectData[index];
  mTitle.innerText = data.title;
  mDesc.innerText = data.desc;
  mIcon.innerText = data.icon;

  // MASUKKAN DATA PROBLEM & SOLUTION DI SINI:
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
  currentGallery =
    data.gallery && data.gallery.length > 0 ? data.gallery : [data.image];
  currentImageIndex = 0;
  updateSlider();

  // ==========================================
  // LOGIKA ANIMASI MUNCUL (UPDATE)
  // ==========================================
  // 1. Tampilkan kontainer utama & cegah scroll
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";

  // 2. Jeda super singkat (10ms) agar efek transisi Tailwind tereksekusi
  setTimeout(() => {
    // Fade in backdrop
    modalBackdrop.classList.remove("opacity-0");
    modalBackdrop.classList.add("opacity-100");

    // Pop up content box
    modalContentBox.classList.remove("opacity-0", "scale-95", "translate-y-4");
    modalContentBox.classList.add("opacity-100", "scale-100", "translate-y-0");
  }, 10);
}

// FUNGSI TUTUP MODAL DENGAN ANIMASI
function closeModal() {
  // ==========================================
  // LOGIKA ANIMASI KELUAR (UPDATE)
  // ==========================================
  // 1. Jalankan animasi pudar dan mengecil
  modalBackdrop.classList.remove("opacity-100");
  modalBackdrop.classList.add("opacity-0");

  modalContentBox.classList.remove("opacity-100", "scale-100", "translate-y-0");
  modalContentBox.classList.add("opacity-0", "scale-95", "translate-y-4");

  // 2. Tunggu animasi selesai (300ms sesuai durasi Tailwind), baru sembunyikan sepenuhnya
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "auto"; // Kembalikan scroll
  }, 300);
}
