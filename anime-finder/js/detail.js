const detailContainer = document.getElementById("detailContainer");

// Ambil ID dari URL
const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
}

async function fetchDetail() {
    try {
        detailContainer.innerHTML = "<p>Loading...</p>";

        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = await response.json();
        displayDetail(data.data);

    } catch (error) {
        detailContainer.innerHTML = "<p>Failed to load detail 😢</p>";
    }
}

function displayDetail(anime) {

    const isFavorited = checkFavorite(anime.mal_id);

    detailContainer.innerHTML = `
        <div style="padding: 20px;">
            <h1>${anime.title}</h1>
            <img src="${anime.images.jpg.image_url}" style="max-width:300px;">
            <p>⭐ Score: ${anime.score ?? "N/A"}</p>
            <p>🎬 Episodes: ${anime.episodes ?? "Unknown"}</p>
            <p>📚 Genre: ${anime.genres.map(g => g.name).join(", ")}</p>
            <p style="max-width:800px;">${anime.synopsis}</p>

            <button onclick="toggleFavorite(${anime.mal_id}, '${anime.title}', '${anime.images.jpg.image_url}')">
                ${isFavorited ? "💔 Remove from Favorite" : "❤️ Add to Favorite"}
            </button>
        </div>
    `;
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function checkFavorite(id) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === id);
}

function toggleFavorite(id, title, image) {
    let favorites = getFavorites();

    if (checkFavorite(id)) {
        favorites = favorites.filter(fav => fav.id !== id);
    } else {
        favorites.push({ id, title, image });
    }

    saveFavorites(favorites);
    location.reload(); // refresh biar tombol update
}

fetchDetail();