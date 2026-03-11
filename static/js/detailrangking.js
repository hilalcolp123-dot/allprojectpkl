document.addEventListener("DOMContentLoaded", () => {

  // DARK MODE
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
  }

  const data = JSON.parse(localStorage.getItem("selectedAnime"));

  if (!data) {
    document.body.innerHTML = "<h2>Data tidak ditemukan.</h2>";
    return;
  }

  // BASIC INFO
  document.getElementById("title").textContent = data.title;
  document.getElementById("poster").src = data.images.jpg.large_image_url;
  document.getElementById("synopsis").textContent =
    data.synopsis || "No synopsis available.";

  document.getElementById("type").textContent =
  "🎞 Type: " + (data.type || "Unknown");

  document.getElementById("score").textContent =
    "⭐ Score: " + (data.score || "N/A");

  document.getElementById("episodes").textContent =
    "🎬 Episodes: " + (data.episodes || "Unknown");

  document.getElementById("duration").textContent =
    "⏱ Duration: " + (data.duration || "Unknown");

  document.getElementById("aired").textContent =
    "📅 Aired: " + (data.aired?.string || "Unknown");

  // GENRES
  const genresContainer = document.getElementById("genres");
  genresContainer.innerHTML = "";

  if (data.genres && data.genres.length > 0) {
    data.genres.forEach(g => {
      const span = document.createElement("span");
      span.textContent = g.name;
      genresContainer.appendChild(span);
    });
  }

});

function goBack() {
  window.history.back();
}