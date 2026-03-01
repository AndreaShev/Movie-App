const searchInputNode = document.querySelector("#search");
const searchBtnNode = document.querySelector("#search-btn");

// Add Enter key support for search
searchInputNode.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchForMovies();
  }
});

// Add input event for autocomplete
searchInputNode.addEventListener("input", debounce(handleSearchInput, 300));

searchBtnNode.addEventListener("click", searchForMovies);

// Filter buttons functionality
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", function () {
    document
      .querySelectorAll(".filter-btn")
      .forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    const genre = this.textContent;
    if (genre !== "All") {
      // Filter by genre
      filterMoviesByGenre(genre);
    } else {
      // Show all movies
      if (searchInputNode.value.trim()) {
        searchForMovies();
      }
    }
  });
});

function searchForMovies() {
  const searchQuery = searchInputNode.value.trim();
  if (!searchQuery) {
    render([]); // Show empty state
    return;
  }

  // Show loading state
  showLoading(true);

  getMovies(searchQuery)
    .then((result) => {
      showLoading(false);
      if (result.Response === "True") {
        const movies = result.Search || [];
        render(movies);
        // Save search to history
        saveSearchHistory(searchQuery);
        // Show recommendations based on search
        showRecommendations(movies);
      } else {
        render(null, result.Error || "No movies found");
      }
    })
    .catch((error) => {
      showLoading(false);
      render(null, "Failed to load movies. Please try again.");
      console.error("Search error:", error);
    });
}

function handleSearchInput() {
  const query = searchInputNode.value.trim();
  if (query.length > 2) {
    // Show autocomplete suggestions here
    showAutocompleteSuggestions(query);
  } else if (query.length === 0) {
    render([]);
  }
}

function showAutocompleteSuggestions(query) {
  // In a real implementation, this would call an API for suggestions
  // For now, we'll just show recent searches
  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || [];
  const suggestions = recentSearches
    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  if (suggestions.length > 0) {
    // Show suggestions dropdown (would need additional HTML/CSS)
    console.log("Suggestions:", suggestions);
  }
}

function saveSearchHistory(query) {
  let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  // Remove duplicate
  recentSearches = recentSearches.filter((item) => item !== query);
  // Add new search to beginning
  recentSearches.unshift(query);
  // Keep only last 10 searches
  recentSearches = recentSearches.slice(0, 10);
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

function filterMoviesByGenre(genre) {
  // In a real implementation, this would filter based on genre
  // For now, we'll just log the action
  console.log(`Filtering by genre: ${genre}`);
}

function showRecommendations(movies) {
  // Show recommendations based on search results
  const recommendedList = document.getElementById("recommended-list");
  if (recommendedList && movies.length > 0) {
    // Just show the first 5 movies as recommendations for demo
    const recommendations = movies.slice(0, 5);
    let html =
      '<div style="display: flex; gap: 15px; overflow-x: auto; padding: 10px 0;">';

    recommendations.forEach((movie) => {
      const { Poster, Title, imdbID } = movie;
      html += `
                <div style="flex: 0 0 auto; width: 150px;">
                    <a href="../movie.html?id=${encodeURIComponent(imdbID)}">
                        <img src="${isValidUrl(Poster) ? escapeHtml(Poster) : "../placeholder.jpg"}" 
                             alt="${escapeHtml(Title)}" 
                             style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" />
                        <p style="margin-top: 5px; font-size: 0.9em; text-align: center;">${escapeHtml(Title)}</p>
                    </a>
                </div>
            `;
    });

    html += "</div>";
    recommendedList.innerHTML = html;
  }
}

function showLoading(show) {
  const searchListNode = document.querySelector("#search-list");
  if (show) {
    searchListNode.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <span>Searching movies...</span>
            </div>
        `;
  }
}

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Helper function to escape HTML (for use in this file)
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Helper function to validate URLs (for use in this file)
function isValidUrl(url) {
  try {
    new URL(url);
    return url.startsWith("http://") || url.startsWith("https://");
  } catch {
    return false;
  }
}
