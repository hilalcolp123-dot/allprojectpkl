document.addEventListener("DOMContentLoaded", () => {

const rankingList = document.getElementById("rankingList");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageNumber = document.getElementById("pageNumber");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const darkToggle = document.getElementById("darkToggle");
const typeSelect = document.getElementById("typeSelect");
const sortSelect = document.getElementById("sortSelect");
const showHentai = document.getElementById("showHentai");
const pageNumbers = document.getElementById("pageNumbers");
let lastPage = 10; // default sementara

const LIMIT = 25;

// ======================
// BACA STATE DARI URL
// ======================
const urlParams = new URLSearchParams(window.location.search);

let currentPage = parseInt(urlParams.get("page")) || 1;
let currentQuery = urlParams.get("q") || "";
let currentType = urlParams.get("type") || "anime";
let currentSort = urlParams.get("sort") || "default";

typeSelect.value = currentType;
sortSelect.value = currentSort;
searchInput.value = currentQuery;

// ======================
// DARK MODE
// ======================
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark") ? "enabled" : "disabled"
  );
});

// ======================
// UPDATE URL TANPA RELOAD
// ======================
function updateURL() {
  const params = new URLSearchParams();

  params.set("page", currentPage);
  params.set("type", typeSelect.value);
  params.set("sort", sortSelect.value);

  if (currentQuery) {
    params.set("q", currentQuery);
  }

  window.history.replaceState({}, "", "?" + params.toString());
}

// ======================
// FETCH DATA
// ======================
async function loadData() {
  rankingList.innerHTML = "<p>Loading...</p>";

  const type = typeSelect.value;
  const sort = sortSelect.value;

  let baseURL = "";
  let params = new URLSearchParams();

  params.append("page", currentPage);
  params.append("limit", LIMIT);

  if (currentQuery) {
    baseURL = `https://api.jikan.moe/v4/${type}`;
    params.append("q", currentQuery);
  } else {
    baseURL = `https://api.jikan.moe/v4/top/${type}`;

    if (sort === "bypopularity" && type === "anime") {
      params.append("filter", "bypopularity");
    }
  }

  const url = `${baseURL}?${params.toString()}`;
  console.log("FETCHING:", url);

  try {
    const res = await fetch(url);

    if (!res.ok) {
      rankingList.innerHTML = `<p>Error API: ${res.status}</p>`;
      return;
    }

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      rankingList.innerHTML = "<p>Tidak ditemukan.</p>";
      return;
    }

    rankingList.innerHTML = "";

    data.data
  .filter(item => {
    if (showHentai.checked) return true;

    // cek apakah ada genre Hentai
    const hasHentai = item.genres?.some(
      g => g.name.toLowerCase() === "hentai"
    );

    return !hasHentai;
  })
  .forEach(item => {
      const div = document.createElement("div");
      div.classList.add("rank-item");

div.innerHTML = `
  <img src="${item.images.jpg.image_url}" alt="${item.title}">
  <div class="overlay">
    <span class="type-badge">${formatType(item.type)}</span>
    <h4>${item.title}</h4>
    <div class="meta">⭐ ${item.score || "N/A"}</div>
    <div class="meta">👥 ${formatNumber(item.members || 0)}</div>
  </div>
`;

      div.addEventListener("click", () => {
        localStorage.setItem("selectedAnime", JSON.stringify(item));

        // BAWA SEMUA STATE KE DETAIL
        window.location.href =
          "/detailranking?" + window.location.search.substring(1);
      });

      rankingList.appendChild(div);
    });

 if (data.pagination && data.pagination.last_visible_page) {
  lastPage = data.pagination.last_visible_page;
}

renderPagination();

    updateURL();

  } catch (err) {
    rankingList.innerHTML = "<p>Gagal load data.</p>";
    console.error(err);
  }
}

// ======================
// FORMAT NUMBER
// ======================
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num;
}

function formatType(type) {
  if (!type) return "";

  const map = {
    "TV": "Series",
    "Movie": "Movie",
    "OVA": "OVA",
    "ONA": "ONA",
    "Special": "Special",
    "Manga": "Manga",
    "One-shot": "One Shot",
    "Manhwa": "Manhwa",
    "Manhua": "Manhua",
    "Novel": "Novel"
  };

  return map[type] || type;
}

function renderPagination() {
  pageNumbers.innerHTML = "";

  const maxVisible = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(lastPage, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    const btn = document.createElement("div");
    btn.textContent = i;
    btn.classList.add("page-number");

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      loadData();
      window.scrollTo(0, 0);
    });

    pageNumbers.appendChild(btn);
  }
}

// ======================
// PAGINATION
// ======================
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadData();
    window.scrollTo(0, 0);
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  loadData();
  window.scrollTo(0, 0);
});

// ======================
// SEARCH
// ======================
searchBtn.addEventListener("click", () => {
  currentQuery = searchInput.value.trim();
  currentPage = 1;
  loadData();
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    loadData();
  }
});

// ======================
// FILTER CHANGE
// ======================
typeSelect.addEventListener("change", () => {
  currentPage = 1;
  loadData();
});

sortSelect.addEventListener("change", () => {
  currentPage = 1;
  loadData();
});

// ======================
// INITIAL LOAD
// ======================
loadData();

});

showHentai.addEventListener("change", () => {
  loadData();
});