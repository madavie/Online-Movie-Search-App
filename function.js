const omdbApiKey = "df122759";

let currentPage = 1;
const moviesPerPage = 20;
let totalMovies = defaultMovies.length;
let totalPages = Math.ceil(totalMovies / moviesPerPage);

async function searchMovie() {
  const movieTitle = document.getElementById("movieTitle").value.trim();
  const omdbApiUrl = `http://www.omdbapi.com/?s=${encodeURIComponent(
    movieTitle
  )}&apikey=${omdbApiKey}`;

  try {
    // Fetch data from OMDB for basic movie details
    const omdbResponse = await fetch(omdbApiUrl);
    const omdbData = await omdbResponse.json();

    if (omdbData.Response === "True") {
      const movies = omdbData.Search.map((movie) => movie.Title);
      displayMovies(movies);
      totalMovies = omdbData.totalResults;
      totalPages = Math.ceil(totalMovies / moviesPerPage);
      updatePaginationButtons();
    } else {
      console.error("Movies not found:", movieTitle);
      const movieResultDiv = document.getElementById("movieResults");
      movieResultDiv.innerHTML = "<p>No movies found.</p>";
      totalMovies = 0;
      totalPages = 0;
      updatePaginationButtons();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayMovies(movies) {
  const movieResultDiv = document.getElementById("movieResults");
  movieResultDiv.innerHTML = "";

  movies.forEach((movie) => {
    searchMovieDetails(movie);
  });
}

async function searchMovieDetails(movieTitle) {
  const omdbApiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(
    movieTitle
  )}&apikey=${omdbApiKey}`;

  try {
    // Fetch data from OMDB for basic movie details
    const omdbResponse = await fetch(omdbApiUrl);
    const omdbData = await omdbResponse.json();
    //console.log(omdbData);

    if (omdbData.Response === "True") {
      const movieResultDiv = document.getElementById("movieResults");

      // Create a container for each movie
      const movieContainer = document.createElement("div");
      movieContainer.classList.add("movie");

      // Construct HTML for movie details
      const movieHTML = `
    <img src="${omdbData.Poster}" alt="${omdbData.Title} Poster" onclick="goToVideoPage('${omdbData.Title}')">
    <p><strong>Year:</strong> ${omdbData.Year}</p>
    <p><strong>Rating:</strong> ${omdbData.imdbRating}</p>
    <h2 onclick="goToVideoPage('${omdbData.Title}')">${omdbData.Title}</h2>
  `;

      movieContainer.innerHTML = movieHTML;

      // Append the movie container to the movie results
      movieResultDiv.appendChild(movieContainer);
    } else {
      console.error("Movie not found:", movieTitle);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    updatePagination();
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    updatePagination();
  }
}

function updatePagination() {
  displayMovies(
    defaultMovies.slice(
      (currentPage - 1) * moviesPerPage,
      currentPage * moviesPerPage
    )
  );
  updatePaginationButtons();
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
//searchMovieDetails();

// Display the first page of movies initially
displayMovies(defaultMovies.slice(0, moviesPerPage));
updatePaginationButtons();