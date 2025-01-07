//javascript\Movie_Website\frontend\movie.js
const API_KEY = "3a398082";
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=`;
const main = document.getElementById("section");
const form = document.getElementById("form");
const queryInput = document.getElementById("query");
const loading = document.getElementById("loading");

async function fetchMovies(searchTerm = "Batman") {
    console.log(`Fetching movies for: ${searchTerm}`);
    showLoading();
    try {
        const response = await fetch(`${BASE_URL}${searchTerm}`);
        const data = await response.json();
        hideLoading();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            main.innerHTML = `<h2 class="no-results">No results found for "${searchTerm}"</h2>`;
        }
    } catch (error) {
        hideLoading();
        console.error("Error fetching movies:", error);
        main.innerHTML = `<h2 class="error">Something went wrong. Please try again later.</h2>`;
    }
}

function displayMovies(movies) {
    console.log("Displaying movies:", movies);
    main.innerHTML = ""; // Clear previous results
    movies.forEach((movie) => {
        const { Title, Year, Poster } = movie;
        const movieCard = document.createElement("div");
        movieCard.classList.add("column");
        movieCard.innerHTML = `
            <div class="card">
                <img src="${Poster !== "N/A" ? Poster : "./public/placeholder.jpg"}" alt="${Title}" class="thumbnail">
                <h3>${Title}</h3>
                <p>${Year}</p>
            </div>
        `;
        main.appendChild(movieCard);

        // Add animation delay for each card
        movieCard.style.animation = `fadeIn 0.5s ease ${movies.indexOf(movie) * 0.1}s`;
        movieCard.style.animationFillMode = "forwards";
    });
}

function showLoading() {
    loading.style.display = "block";
}

function hideLoading() {
    loading.style.display = "none";
}

// Event Listeners
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTerm = queryInput.value.trim();
    if (searchTerm) {
        fetchMovies(searchTerm);
        queryInput.value = ""; // Clear input after search
    }
});

// Load default movies on page load
window.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
});
