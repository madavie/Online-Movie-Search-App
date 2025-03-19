// OMDB API Key
const omdbApiKey = "df122759";

// TMDB API Key
const tmdbApiKey = "1ede6306059e84eee3785c0706e91188";

// Get the movie title from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const movieTitle = urlParams.get("title");

// Set the video source (replace with actual video URL from a streaming API)
const videoPlayer = document.getElementById("videoPlayer");
const videoUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
  movieTitle + " trailer"
)}`;
videoPlayer.src = videoUrl;

// Fetch and display movie details
fetchMovieDetails(movieTitle);

async function fetchMovieDetails(movieTitle) {
  const omdbApiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(
    movieTitle
  )}&apikey=${omdbApiKey}`;

  try {
    const response = await fetch(omdbApiUrl);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovieDetails(data);
    } else {
      console.error("Movie not found:", movieTitle);
      document.getElementById("movieDetails").innerHTML =
        "<p>Movie not found.</p>";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("movieDetails").innerHTML =
      "<p>Error fetching data.</p>";
  }
}

async function displayMovieDetails(movieData) {
  const movieDetailsDiv = document.getElementById("movieDetails");

  const actors = movieData.Actors.split(", ");

  let actorsHTML = "";
  for (const actor of actors) {
    const actorDetails = await fetchActorDetails(actor);
    actorsHTML += `
      <div class="actor">
        <h3>${actor}</h3>
        <img src="${actorDetails.img}" alt="${actor} Image">
      </div>
    `;
  }

  const movieHTML = `
    <h2>${movieData.Title}</h2>
    <img src="${movieData.Poster}" alt="${movieData.Title} Poster">
    <p><strong>Year:</strong> ${movieData.Year}</p>
    <p><strong>Genre:</strong> ${movieData.Genre}</p>
    <p><strong>Director:</strong> ${movieData.Director}</p>
    <p><strong>Actors:</strong></p>
    <div class="actors-container">${actorsHTML}</div>
    <p><strong>Plot:</strong> ${movieData.Plot}</p>
  `;

  movieDetailsDiv.innerHTML = movieHTML;
}

async function fetchActorDetails(actorName) {
  const tmdbApiUrl = `https://api.themoviedb.org/3/search/person?api_key=${tmdbApiKey}&query=${encodeURIComponent(
    actorName
  )}`;

  try {
    const response = await fetch(tmdbApiUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const actorDetails = {
        img: `https://image.tmdb.org/t/p/w185${data.results[0].profile_path}`,
      };
      return actorDetails;
    } else {
      console.error("Actor not found:", actorName);
      return { img: "https://via.placeholder.com/150" }; // Placeholder image
    }
  } catch (error) {
    console.error("Error fetching actor data:", error);
    return { img: "https://via.placeholder.com/150" }; // Placeholder image
  }
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

// Load saved theme from localStorage
window.onload = () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
};

// Go back to the search page
function goBack() {
  window.location.href = "index.html";
}