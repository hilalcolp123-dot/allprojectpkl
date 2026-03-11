// DARK MODE
if(localStorage.getItem("mode")==="dark"){
    document.body.classList.add("dark");
}

// AMBIL PARAMETER ID
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadDetail(){
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const res = await fetch(url);
    const data = await res.json();
    const meal = data.meals[0];
    
    // kumpulkan ingredients
    let ingredients = "";
    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
    }

    const detail = document.getElementById("detail");

    // render detail termasuk tombol favorit
    detail.innerHTML = `
    <div class="detail-card">
        <img src="${meal.strMealThumb}" class="detail-img">
        <h1>${meal.strMeal}</h1>
        <p class="meta">${meal.strCategory} • ${meal.strArea}</p>
        <button id="fav-btn">❤️ Tambah ke Favorit</button>
        <div class="detail-grid">
            <div>
                <h2>Bahan</h2>
                <ul class="ingredients">${ingredients}</ul>
            </div>
            <div>
                <h2>Instruksi</h2>
                <p class="instructions">${meal.strInstructions}</p>
            </div>
        </div>
    </div>
    `;

    // update tombol favorit sesuai status
    const favBtn = document.getElementById("fav-btn");
    updateFavButton(favBtn, meal);
}

// fungsi toggle tombol favorit
function updateFavButton(btn, meal){
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    function refreshButton(){
        favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if(favorites.some(fav => fav.id == meal.idMeal)){
            btn.classList.add("favorite");
            btn.innerHTML = "💔 Hapus dari Favorit";
        } else {
            btn.classList.remove("favorite");
            btn.innerHTML = "❤️ Tambah ke Favorit";
        }
    }

    // pasang klik
    btn.onclick = () => {
        favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        if(favorites.some(fav => fav.id == meal.idMeal)){
            favorites = favorites.filter(fav => fav.id != meal.idMeal);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            refreshButton();
            alert("Resep dihapus dari favorit 💔");
        } else {
            favorites.push({
                id: meal.idMeal,
                name: meal.strMeal,
                thumb: meal.strMealThumb
            });
            localStorage.setItem("favorites", JSON.stringify(favorites));
            refreshButton();
            alert("Resep ditambahkan ke favorit ❤️");
        }
    };

    // update awal
    refreshButton();
}

loadDetail();