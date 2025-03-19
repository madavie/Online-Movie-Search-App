const omdbApiKey = "df122759";

let currentPage = 1;
const moviesPerPage = 10; // Reduced for better pagination
let totalMovies = 0;
let totalPages = 0;
let currentSearchQuery = "";

// Default movies to display on page load
const defaultMovies = [
  "Inception",
  "The Dark Knight",
  "Interstellar",
  "The Matrix",
  "Gladiator",
  "Avatar",
  "Titanic",
  "The Avengers",
  "Jurassic Park",
  "Forrest Gump",
];

// Fetch and display default movies on page load
window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
  displayDefaultMovies();
};

async function displayDefaultMovies() {
  const movieResultDiv = document.getElementById("movieResults");
  movieResultDiv.innerHTML = "";

  for (const movieTitle of defaultMovies) {
    await searchMovieDetails(movieTitle);
  }
}

async function searchMovie() {
  const movieTitle = document.getElementById("movieTitle").value.trim();
  if (!movieTitle) return;

  currentSearchQuery = movieTitle;
  currentPage = 1; // Reset to first page on new search
  await fetchMovies();
}

async function fetchMovies() {
  const omdbApiUrl = `http://www.omdbapi.com/?s=${encodeURIComponent(
    currentSearchQuery
  )}&apikey=${omdbApiKey}&page=${currentPage}`;

  showLoadingSpinner(true);

  try {
    const response = await fetch(omdbApiUrl);
    const data = await response.json();

    if (data.Response === "True") {
      const movies = data.Search;
      totalMovies = parseInt(data.totalResults);
      totalPages = Math.ceil(totalMovies / moviesPerPage);
      displayMovies(movies);
      updatePaginationButtons();
    } else {
      displayError("No movies found. Please try another search.");
    }
  } catch (error) {
    displayError("Error fetching data. Please try again.");
  } finally {
    showLoadingSpinner(false);
  }
}

function displayMovies(movies) {
  const movieResultDiv = document.getElementById("movieResults");
  movieResultDiv.innerHTML = "";

  movies.forEach((movie) => {
    searchMovieDetails(movie);
  });
}

async function searchMovieDetails(movie) {
  const omdbApiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(
    movie.Title || movie
  )}&apikey=${omdbApiKey}`;

  try {
    const response = await fetch(omdbApiUrl);
    const data = await response.json();

    if (data.Response === "True") {
      const movieResultDiv = document.getElementById("movieResults");

      // Create a container for each movie
      const movieContainer = document.createElement("div");
      movieContainer.classList.add("movie");

      // Construct HTML for movie details
      const movieHTML = `
        <img src="${data.Poster}" alt="${data.Title} Poster" onclick="goToVideoPage('${data.Title}')">
        <p><strong>Year:</strong> ${data.Year}</p>
        <p><strong>Rating:</strong> ${data.imdbRating}</p>
        <h2 onclick="goToVideoPage('${data.Title}')">${data.Title}</h2>
      `;

      movieContainer.innerHTML = movieHTML;
      movieResultDiv.appendChild(movieContainer);
    } else {
      console.error("Movie not found:", movie.Title || movie);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchMovies();
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    fetchMovies();
  }
}

function updatePaginationButtons() {
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

function goToVideoPage(movieTitle) {
  window.location.href = `video.html?title=${encodeURIComponent(
    movieTitle
  )}`;
}

function showLoadingSpinner(show) {
  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = show ? "block" : "none";
}

function displayError(message) {
  const movieResultDiv = document.getElementById("movieResults");
  movieResultDiv.innerHTML = `<p class="error-message">${message}</p>`;
}

// Theme Toggle Functionality
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  body.setAttribute("data-theme", newTheme);

  // Save theme preference to localStorage
  localStorage.setItem("theme", newTheme);
}