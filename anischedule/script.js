// ========================
// ELEMENT
// ========================

const container = document.getElementById("anime-list");
const buttons = document.querySelectorAll(".day-btn");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("closeModal");


// ========================
// EVENT LISTENER
// ========================

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    loadSchedule(btn.dataset.day);
  });
});

closeModal.onclick = () => modal.classList.add("hidden");

window.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};


// ========================
// FUNCTION LOAD SCHEDULE
// ========================

async function loadSchedule(day) {

  // active button
  buttons.forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-day="${day}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  container.innerHTML = "Loading...";

  try {
    const res = await fetch(`https://api.jikan.moe/v4/schedules?filter=${day}`);
    const data = await res.json();

    container.innerHTML = "";

    data.data.forEach(anime => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${anime.images.jpg.image_url}">
        <h3>${anime.title}</h3>
      `;

      card.addEventListener("click", () => {
        showDetail(anime.mal_id);
      });

      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = "Gagal ambil data 😢";
  }
}


// ========================
// FUNCTION SHOW DETAIL
// ========================

async function showDetail(id) {

  modal.classList.remove("hidden");
  modalBody.innerHTML = "Loading...";

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const data = await res.json();
    const anime = data.data;
    const genres = [
  ...(anime.genres || []),
  ...(anime.themes || []),
  ...(anime.demographics || [])
];

const genreHTML = genres.length
  ? genres.map(g => `<span class="genre-badge">${g.name}</span>`).join("")
  : "Unknown";

    modalBody.innerHTML = `
    <img src="${anime.images.jpg.large_image_url}">
    <h2>${anime.title}</h2>
    <div><strong>Genre:</strong><br>${genreHTML}</div>
    <p class="synopsis">
    ${anime.synopsis ?? "No synopsis available."}
    </p>
    `;

  } catch (err) {
    modalBody.innerHTML = "Gagal ambil detail 😢";
  }
}

loadSchedule("monday");