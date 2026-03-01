const movieNode = document.querySelector("#movie");

function render(movie, errorMessage = null) {
  if (errorMessage) {
    movieNode.innerHTML = `
            <div class="error-container">
                <div class="spinner"></div>
                <h2>Error Loading Movie</h2>
                <p>${escapeHtml(errorMessage)}</p>
                <a href="../index.html" class="back-link">← Back to Search</a>
            </div>
        `;
    return;
  }

  if (!movie || movie.Response === "False") {
    movieNode.innerHTML = `
            <div class="no-movie">
                <h2>Movie Not Found</h2>
                <p>The requested movie could not be found.</p>
                <a href="../index.html" class="back-link">← Back to Search</a>
            </div>
        `;
    return;
  }

  const {
    Title,
    Year,
    Rated,
    Released,
    Runtime,
    Genre,
    Director,
    Writer,
    Actors,
    Plot,
    Language,
    Country,
    Awards,
    Poster,
    imdbRating,
    imdbVotes,
    Ratings = [],
  } = movie;

  // Get IMDb rating specifically
  const imdbRatingValue =
    Ratings.find((rating) => rating.Source === "Internet Movie Database")
      ?.Value ||
    imdbRating ||
    "N/A";

  movieNode.innerHTML = `
        <article class="movie-detail">
            <div class="movie-header">
                <img src="${isValidUrl(Poster) ? escapeHtml(Poster) : "../placeholder.jpg"}" 
                     alt="${escapeHtml(Title)}" 
                     class="movie-poster" />
                
                <div class="movie-info">
                    <h1 class="movie-title">${escapeHtml(Title)}</h1>
                    
                    <div class="movie-meta">
                        <div class="meta-item">${escapeHtml(Year)}</div>
                        <div class="meta-item">${escapeHtml(Rated)}</div>
                        <div class="meta-item">${escapeHtml(Runtime)}</div>
                        <div class="meta-item">${escapeHtml(Genre)}</div>
                    </div>
                    
                    <div class="ratings">
                        <div class="rating-item imdb-rating">
                            <span>IMDb:</span>
                            <span>${escapeHtml(imdbRatingValue)}</span>
                        </div>
                        <div class="rating-item">
                            <span>Votes:</span>
                            <span>${escapeHtml(imdbVotes || "N/A")}</span>
                        </div>
                    </div>
                    
                    <div class="actions">
                        <button class="action-btn watch-btn">
                            ▶️ Watch Trailer
                        </button>
                        <button class="action-btn like-btn" id="detail-like-btn">
                            ❤️ Like
                        </button>
                        <button class="action-btn bookmark-btn" id="detail-bookmark-btn">
                            📌 Bookmark
                        </button>
                    </div>
                </div>
            </div>
            
            <section class="movie-details">
                <div class="details-grid">
                    <div class="detail-item">
                        <strong>Director</strong>
                        <span>${escapeHtml(Director || "N/A")}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Writer</strong>
                        <span>${escapeHtml(Writer || "N/A")}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Cast</strong>
                        <span>${escapeHtml(Actors || "N/A")}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Language</strong>
                        <span>${escapeHtml(Language || "N/A")}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Country</strong>
                        <span>${escapeHtml(Country || "N/A")}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Awards</strong>
                        <span>${escapeHtml(Awards || "N/A")}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Release Date</strong>
                        <span>${escapeHtml(Released || "N/A")}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Box Office</strong>
                        <span>N/A</span>
                    </div>
                </div>
                
                <div class="plot">
                    <h3>Plot Summary</h3>
                    <p>${escapeHtml(Plot || "No plot available.")}</p>
                </div>
                
                <section class="cast-section">
                    <h3 class="cast-title">Cast & Crew</h3>
                    <div class="cast-grid">
                        <div class="cast-member">
                            <img src="../placeholder.jpg" alt="Actor" class="cast-photo">
                            <div>Lead Actor</div>
                        </div>
                        <div class="cast-member">
                            <img src="../placeholder.jpg" alt="Actor" class="cast-photo">
                            <div>Supporting Actor</div>
                        </div>
                        <div class="cast-member">
                            <img src="../placeholder.jpg" alt="Actor" class="cast-photo">
                            <div>Director</div>
                        </div>
                        <div class="cast-member">
                            <img src="../placeholder.jpg" alt="Actor" class="cast-photo">
                            <div>Producer</div>
                        </div>
                    </div>
                </section>
                
                <section class="reviews-section">
                    <h3 class="reviews-title">Top Reviews</h3>
                    <div class="review-card">
                        <div class="review-header">
                            <div class="review-author">John Doe</div>
                            <div class="review-rating">★★★★☆</div>
                        </div>
                        <p>This movie was absolutely fantastic! Great storyline and amazing visual effects.</p>
                    </div>
                    <div class="review-card">
                        <div class="review-header">
                            <div class="review-author">Jane Smith</div>
                            <div class="review-rating">★★★☆☆</div>
                        </div>
                        <p>Good movie with great acting, but the plot was somewhat predictable.</p>
                    </div>
                </section>
            </section>
        </article>
    `;

  // Initialize detail page buttons
  initializeDetailPageButtons(movie.imdbID);
}

// Helper function to escape HTML (same as in movies/view.js)
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Helper function to validate URLs (same as in movies/view.js)
function isValidUrl(url) {
  try {
    new URL(url);
    return url.startsWith("http://") || url.startsWith("https://");
  } catch {
    return false;
  }
}

// Initialize buttons for detail page
function initializeDetailPageButtons(movieId) {
  const likeBtn = document.getElementById("detail-like-btn");
  const bookmarkBtn = document.getElementById("detail-bookmark-btn");

  if (likeBtn) {
    const likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || [];
    if (likedMovies.includes(movieId)) {
      likeBtn.innerHTML = "❤️ Liked";
      likeBtn.style.background = "var(--gradient-accent)";
    }

    likeBtn.addEventListener("click", () => {
      toggleLike(movieId);
      const likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || [];
      if (likedMovies.includes(movieId)) {
        likeBtn.innerHTML = "🤍 Like";
        likeBtn.style.background = "var(--gradient-primary)";
      } else {
        likeBtn.innerHTML = "❤️ Liked";
        likeBtn.style.background = "var(--gradient-accent)";
      }
    });
  }

  if (bookmarkBtn) {
    const bookmarkedMovies =
      JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];
    if (bookmarkedMovies.includes(movieId)) {
      bookmarkBtn.innerHTML = "📌 Bookmarked";
    }

    bookmarkBtn.addEventListener("click", () => {
      toggleBookmark(movieId);
      const bookmarkedMovies =
        JSON.parse(localStorage.getItem("bookmarkedMovies")) || [];
      if (bookmarkedMovies.includes(movieId)) {
        bookmarkBtn.innerHTML = "📌 Bookmarked";
      } else {
        bookmarkBtn.innerHTML = "📑 Bookmark";
      }
    });
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
}
