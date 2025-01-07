//scrpit.js
// File: frontend/script.js
const API_KEY = "3a398082";
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;
// Added backend connection
const BACKEND_URL = "https://protective-wisdom-production.up.railway.app/api/v1/reviews";

const main = document.getElementById("section");
const form = document.getElementById("form");
const queryInput = document.getElementById("query");
const loading = document.getElementById("loading");

async function fetchMovies(searchTerm = "Batman") {
    console.log(`Fetching movies for: ${searchTerm}`);
    showLoading();
    try {
        const response = await fetch(`${BASE_URL}${searchTerm}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        hideLoading();

        if (data.Response === "True") {
            // Added: Fetch reviews for each movie
            const moviesWithReviews = await Promise.all(
                data.Search.map(async (movie) => {
                    const reviews = await fetchReviews(movie.imdbID);
                    return { ...movie, reviews };
                })
            );
            displayMovies(moviesWithReviews);
        } else {
            main.innerHTML = `<h2 class="no-results">No results found for "${searchTerm}"</h2>`;
        }
    } catch (error) {
        hideLoading();
        console.error("Error fetching movies:", error);
        main.innerHTML = `<h2 class="error">Something went wrong. Please try again later.</h2>`;
    }
}

// Added: Function to fetch reviews
async function fetchReviews(movieId) {
    try {
        const response = await fetch(`${BACKEND_URL}/movie/${movieId}`);
        const reviews = await response.json();
        return reviews;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
}

// Added: Function to submit reviews
async function submitReview(movieId, review, user = "Anonymous") {
    try {
        const response = await fetch(`${BACKEND_URL}/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieId, review, user })
        });
        return response.json();
    } catch (error) {
        console.error("Error submitting review:", error);
        throw error;
    }
}

function displayMovies(movies) {
    console.log("Displaying movies:", movies);
    main.innerHTML = "";
    movies.forEach((movie) => {
        const { Title, Year, Poster, imdbID, reviews } = movie;
        const movieCard = document.createElement("div");
        movieCard.classList.add("column");
        movieCard.innerHTML = `
            <div class="card">
                <img src="${Poster !== "N/A" ? Poster : "./placeholder.jpg"}" alt="${Title}" class="thumbnail">
                <h3>${Title}</h3>
                <p>${Year}</p>
                <div class="review-section">
                    <form class="review-form" onsubmit="event.preventDefault(); handleReviewSubmit('${imdbID}', this)">
                        <textarea placeholder="Write your review..." required></textarea>
                        <button type="submit" class="review-button">Add Review</button>
                    </form>
                    <div class="reviews">
                        <h4>Reviews:</h4>
                        ${reviews?.length ? reviews.map(r => `
                            <div class="review">
                                <p>${r.review}</p>
                                <small>- ${r.user}</small>
                            </div>
                        `).join('') : '<p>No reviews yet</p>'}
                    </div>
                </div>
            </div>
        `;
        main.appendChild(movieCard);
    });
}

// Added: Handle review submission
async function handleReviewSubmit(movieId, form) {
    const textarea = form.querySelector('textarea');
    const review = textarea.value;
    
    try {
        await submitReview(movieId, review);
        textarea.value = '';
        // Refresh movies to show new review
        const searchTerm = queryInput.value.trim() || 'Batman';
        await fetchMovies(searchTerm);
    } catch (error) {
        console.error("Error submitting review:", error);
        alert("Failed to submit review. Please try again.");
    }
}

function showLoading() {
    loading.style.display = "block";
}

function hideLoading() {
    loading.style.display = "none";
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTerm = queryInput.value.trim();
    if (searchTerm) {
        fetchMovies(searchTerm);
        queryInput.value = "";
    }
});

window.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
});