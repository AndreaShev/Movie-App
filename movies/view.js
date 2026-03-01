const searchListNode = document.querySelector("#search-list");

function render(movies, errorMessage = null) {
  let html = "";

  if (errorMessage) {
    html = `<div class="error-message">${escapeHtml(errorMessage)}</div>`;
    searchListNode.innerHTML = html;
    return;
  }

  if (!movies || movies.length === 0) {
    html = '<div class="no-movies">No movies found</div>';
    searchListNode.innerHTML = html;
    return;
  }

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();

  movies.forEach((movie) => {
    const {
      Poster,
      Title,
      Year,
      Type,
      imdbID,
      imdbRating = "N/A",
      Genre = "N/A",
    } = movie;

    const movieElement = document.createElement("div");
    movieElement.className = "movie-item";

    // Generate rating stars based on IMDb rating
    let ratingStars = "";
    if (imdbRating !== "N/A") {
      const rating = parseFloat(imdbRating);
      if (!isNaN(rating)) {
        const fullStars = Math.floor(rating / 2); // Convert 10-point to 5-star scale
        for (let i = 0; i < fullStars; i++) {
          ratingStars += "★";
        }
        for (let i = fullStars; i < 5; i++) {
          ratingStars += "☆";
        }
      } else {
        ratingStars = "N/A";
      }
    } else {
      ratingStars = "N/A";
    }

    movieElement.innerHTML = `
            <a href="../movie.html?id=${encodeURIComponent(imdbID)}"> 
                <img src="${isValidUrl(Poster) ? escapeHtml(Poster) : "../placeholder.jpg"}" 
                     alt="${escapeHtml(Title)}" 
                     class="movie-poster" />
                <div class="movie-info">
                    <h3 class="movie-title">${escapeHtml(Title)}</h3>
                    <div class="movie-meta">
                        <span>${escapeHtml(Year)}</span>
                        <span>${escapeHtml(Type)}</span>
                        <div class="movie-rating">${ratingStars} ${imdbRating !== "N/A" ? escapeHtml(imdbRating) : ""}</div>
                    </div>
                    <div class="movie-actions">
                        <button class="like-btn" data-movie-id="${imdbID}" onclick="toggleLike('${imdbID}'); event.preventDefault(); event.stopPropagation();">🤍</button>
                        <button class="bookmark-btn" data-movie-id="${imdbID}" onclick="toggleBookmark('${imdbID}'); event.preventDefault(); event.stopPropagation();">📑</button>
                    </div>
                </div>
            </a>  
        `;

    fragment.appendChild(movieElement);
  });

  searchListNode.innerHTML = "";
  searchListNode.appendChild(fragment);

  // Initialize button states after rendering
  initializeButtonStates();
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Helper function to validate URLs
function isValidUrl(url) {
  try {
    new URL(url);
    return url.startsWith("http://") || url.startsWith("https://");
  } catch {
    return false;
  }
}

// Like and bookmark functionality
function toggleLike(movieId) {
  let likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const index = likedMovies.indexOf(movieId);

  if (index === -1) {
    likedMovies.push(movieId);
  } else {
    likedMovies.splice(index, 1);
  }

  localStorage.setItem("likedMovies", JSON.stringify(likedMovies));
  updateButtonStates();
}

function toggleBookmark(movieId) {
  let bookmarkedMovies =
    JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];
  const index = bookmarkedMovies.indexOf(movieId);

  if (index === -1) {
    bookmarkedMovies.push(movieId);
  } else {
    bookmarkedMovies.splice(index, 1);
  }

  localStorage.setItem("bookmarkedMovies", JSON.stringify(bookmarkedMovies));
  updateButtonStates();
}

// Initialize button states based on localStorage
function initializeButtonStates() {
  const likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const bookmarkedMovies =
    JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];

  document.querySelectorAll(".like-btn").forEach((btn) => {
    const movieId = btn.dataset.movieId;
    if (likedMovies.includes(movieId)) {
      btn.textContent = "❤️";
      btn.style.color = "#ff2d75";
    } else {
      btn.textContent = "🤍";
      btn.style.color = "";
    }
  });

  document.querySelectorAll(".bookmark-btn").forEach((btn) => {
    const movieId = btn.dataset.movieId;
    if (bookmarkedMovies.includes(movieId)) {
      btn.textContent = "🔖";
      btn.style.color = "#ff2d75";
    } else {
      btn.textContent = "📑";
      btn.style.color = "";
    }
  });
}

// Update button states after interaction
function updateButtonStates() {
  const likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const bookmarkedMovies =
    JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];

  document.querySelectorAll(".like-btn").forEach((btn) => {
    const movieId = btn.dataset.movieId;
    if (likedMovies.includes(movieId)) {
      btn.textContent = "❤️";
      btn.style.color = "#ff2d75";
    } else {
      btn.textContent = "🤍";
      btn.style.color = "";
    }
  });

  document.querySelectorAll(".bookmark-btn").forEach((btn) => {
    const movieId = btn.dataset.movieId;
    if (bookmarkedMovies.includes(movieId)) {
      btn.textContent = "🔖";
      btn.style.color = "#ff2d75";
    } else {
      btn.textContent = "📑";
      btn.style.color = "";
    }
  });
}
