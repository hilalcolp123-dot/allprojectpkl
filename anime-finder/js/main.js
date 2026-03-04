const container = document.getElementById("animeContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const ratingSelect = document.getElementById("ratingSelect");
let currentRating = "all";

// Fetch anime dari API
async function fetchAnime(query) {
    try {
        container.innerHTML = "<p>Loading...</p>";

        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
        const data = await response.json();

        const filtered = applyRatingFilter(data.data).slice(0, 18);
        displayAnime(filtered); // Batasi 12 hasil

    } catch (error) {
        console.error("Error fetching data:", error);
        container.innerHTML = "<p>Failed to load data 😢</p>";
    }
}

// Tampilkan ke grid
function displayAnime(animes) {
    container.innerHTML = "";

    if (animes.length === 0) {
        container.innerHTML = "<p>No anime found.</p>";
        return;
    }

    animes.forEach(anime => {
        const card = `
            <div class="anime-card" onclick="goToDetail(${anime.mal_id})">
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <h3>${anime.title}</h3>
                <p>⭐ ${anime.score ?? "N/A"}</p>
            </div>
        `;
        container.innerHTML += card;
    });
}

function goToDetail(id) {
    window.location.href = `detail.html?id=${id}`;
}

// Klik tombol
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchAnime(query);
    }
});

// Tekan Enter
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
            fetchAnime(query);
        }
    }
});

function loadFavorites() {
    const favoriteContainer = document.getElementById("favoriteContainer");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favoriteContainer.innerHTML = "";

    favorites.forEach(anime => {
        const card = `
            <div class="anime-card" onclick="goToDetail(${anime.id})">
                <img src="${anime.image}">
                <h3>${anime.title}</h3>
            </div>
        `;
        favoriteContainer.innerHTML += card;
    });
}

loadFavorites();

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeToggle.textContent = "🌙 Dark Mode";
    }
}

loadTheme();

// Toggle theme
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";
    } else {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀ Light Mode";
    }
});

async function fetchTopAnime() {
    try {
        container.innerHTML = "<p>Loading popular anime...</p>";

        const response = await fetch("https://api.jikan.moe/v4/top/anime");
        const data = await response.json();

        const filtered = applyRatingFilter(data.data).slice(0, 18);
        displayAnime(filtered); // tampilkan 12

    } catch (error) {
        container.innerHTML = "<p>Failed to load popular anime 😢</p>";
    }
}

fetchTopAnime();

const genreSelect = document.getElementById("genreSelect");

// Ambil daftar genre
async function fetchGenres() {
    try {
        const response = await fetch("https://api.jikan.moe/v4/genres/anime");
        const data = await response.json();

        data.data.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.mal_id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Failed to load genres");
    }
}

genreSelect.addEventListener("change", () => {
    const genreId = genreSelect.value;

    if (genreId) {
        fetchByGenre(genreId);
    } else {
        fetchTopAnime(); // balik ke populer kalau kosong
    }
});

async function fetchByGenre(id) {
    try {
        container.innerHTML = "<p>Loading genre...</p>";

        const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${id}`);
        const data = await response.json();

        const filtered = applyRatingFilter(data.data).slice(0, 18);
        displayAnime(filtered);

    } catch (error) {
        container.innerHTML = "<p>Failed to load genre 😢</p>";
    }
}

fetchGenres();

function applyRatingFilter(animeArray) {

    if (currentRating === "safe") {
        return animeArray.filter(anime =>
            anime.rating !== "R - 17+ (violence & profanity)" &&
            anime.rating !== "R+ - Mild Nudity" &&
            anime.rating !== "Rx - Hentai"
        );
    }

    if (currentRating === "adult") {
        return animeArray.filter(anime =>
            anime.rating !== "Rx - Hentai"
        );
    }

    return animeArray;
}

ratingSelect.addEventListener("change", () => {
    currentRating = ratingSelect.value;
    fetchTopAnime(); // reload sesuai filter
});