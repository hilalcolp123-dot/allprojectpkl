// =======================
// DARK MODE
// =======================

function toggleDarkMode(){
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("mode","dark");
    }else{
        localStorage.setItem("mode","light");
    }
}

// load mode saat halaman dibuka
if(localStorage.getItem("mode") === "dark"){
    document.body.classList.add("dark");
}


// =======================
// LOAD LAST SEARCH
// =======================

window.onload = () => {
    const savedResults = localStorage.getItem("lastResults");

    if(savedResults){
        document.getElementById("results").innerHTML = savedResults;
    }
}

const inputField = document.getElementById("ingredients");
if(inputField){
    inputField.addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            searchRecipes();
        }
    });
}

const resultsDiv = document.getElementById("results");
if(resultsDiv){
    resultsDiv.innerHTML = ""; // misal bagian reset hasil
}

// =======================
// SEARCH RECIPES
// =======================

async function searchRecipes(){

    const input = document.getElementById("ingredients").value;

    if(!input){
        alert("Masukkan bahan terlebih dahulu");
        return;
    }

    const ingredients = input.split(",").map(i => i.trim().toLowerCase());

    const firstIngredient = ingredients[0];

    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${firstIngredient}`;

    const res = await fetch(url);
    const data = await res.json();

    const results = document.getElementById("results");
    results.innerHTML = "🔍 Mencari resep...";

    if(!data.meals){
        results.innerHTML = "<p>Resep tidak ditemukan 😢</p>";
        return;
    }

    // ambil semua detail sekaligus
    const detailPromises = data.meals.map(meal =>
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
        .then(res => res.json())
    );

    const allDetails = await Promise.all(detailPromises);

    let found = false; // flag apakah ada resep cocok
    results.innerHTML = "";

    for(const detailData of allDetails){

        const mealDetail = detailData.meals[0];

        let mealIngredients = [];

        for(let i=1;i<=20;i++){
            if(mealDetail[`strIngredient${i}`]){
                mealIngredients.push(mealDetail[`strIngredient${i}`].toLowerCase());
            }
        }

        let match = ingredients.every(i =>
            mealIngredients.includes(i)
        );

        if(match){
            found = true;

        results.innerHTML += `
            <div class="card">
            <img src="${mealDetail.strMealThumb}">
            <h3>${mealDetail.strMeal}</h3>

            <a href="/resep-detail?id=${mealDetail.idMeal}">
                Lihat Resep
            </a>

</div>
`;
        }
    }

    if(!found){
        results.innerHTML = "<p>Resep tidak ditemukan 😢</p>";
    }

    // simpan hasil supaya tetap ada saat kembali dari detail
    localStorage.setItem("lastResults", results.innerHTML);
}

function addFavorite(id, name, thumb){
    // ambil favorite dari localStorage
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // cek apakah sudah ada
    if(favorites.some(fav => fav.id == id)){
        alert("Resep sudah ada di favorit!");
        return;
    }

    favorites.push({id, name, thumb});

    localStorage.setItem("favorites", JSON.stringify(favorites));

    alert("Resep ditambahkan ke favorit ❤️");
}