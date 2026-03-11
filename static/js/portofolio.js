const carousel = document.querySelector(".projects-carousel");
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");

// Variabel untuk Dragging
let isDown = false;
let startX;
let scrollLeft;

carousel.addEventListener("mousedown", (e) => {
  isDown = true;
  carousel.classList.add("active");
  // e.pageX adalah posisi mouse, offsetLeft adalah jarak carousel ke pinggir layar
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener("mouseleave", () => {
  isDown = false;
  carousel.classList.remove("active");
});

carousel.addEventListener("mouseup", () => {
  isDown = false;
  carousel.classList.remove("active");
});

carousel.addEventListener("mousemove", (e) => {
  if (!isDown) return; // Berhenti jika mouse tidak ditekan
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 2; // Angka 2 adalah sensitivitas/kecepatan geser
  carousel.scrollLeft = scrollLeft - walk;
});

// --- LOGIKA TOMBOL NAVIGASI ---
function moveCarousel(direction) {
  const card = carousel.querySelector(".project-card");
  const cardWidth = card.offsetWidth;
  const gap = 20;
  const scrollAmount = (cardWidth + gap) * 2;

  carousel.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}

// 1. Fungsi Geser Manual
function moveCarousel(direction) {
  const card = carousel.querySelector(".project-card");
  const cardWidth = card.offsetWidth;
  const gap = 20;
  const scrollAmount = (cardWidth + gap) * 3; // Geser 3 kartu

  carousel.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}

// 2. Logika Sembunyikan Tombol di Ujung
function updateButtons() {
  btnPrev.style.display = carousel.scrollLeft <= 5 ? "none" : "block";

  const isEnd =
    carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 5;
  btnNext.style.display = isEnd ? "none" : "block";
}

carousel.addEventListener("scroll", updateButtons);
window.onload = updateButtons;
