const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const movieId = urlParams.get("id");

if (movieId) {
  getMovie(movieId)
    .then((movie) => {
      // Fixed: was using 'result' which doesn't exist
      render(movie);
      // Initialize social sharing buttons after render
      initializeSocialSharing(movie.Title, movie.Poster);
    })
    .catch((error) => {
      console.error("Error loading movie:", error);
      render(null, "Failed to load movie details. Please try again.");
    });
} else {
  render(null, "No movie ID provided.");
}

// Initialize social sharing functionality
function initializeSocialSharing(title, poster) {
  // Wait for DOM to be ready
  setTimeout(() => {
    // Facebook share
    const fbBtn = document.querySelector(".social-btn:nth-child(1)");
    if (fbBtn) {
      fbBtn.addEventListener("click", () => {
        const url = encodeURIComponent(window.location.href);
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
      });
    }

    // Twitter share
    const twBtn = document.querySelector(".social-btn:nth-child(2)");
    if (twBtn) {
      twBtn.addEventListener("click", () => {
        const text = encodeURIComponent(`Check out ${title} on CineVerse!`);
        const url = encodeURIComponent(window.location.href);
        const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
      });
    }

    // LinkedIn share
    const liBtn = document.querySelector(".social-btn:nth-child(3)");
    if (liBtn) {
      liBtn.addEventListener("click", () => {
        const titleEnc = encodeURIComponent(title);
        const url = encodeURIComponent(window.location.href);
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
      });
    }

    // General share (uses Web Share API if available)
    const genBtn = document.querySelector(".social-btn:nth-child(4)");
    if (genBtn) {
      genBtn.addEventListener("click", () => {
        if (navigator.share) {
          navigator
            .share({
              title: title,
              text: `Check out ${title} on CineVerse!`,
              url: window.location.href,
            })
            .catch(console.error);
        } else {
          // Fallback: copy link to clipboard
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
              alert("Link copied to clipboard!");
            })
            .catch((err) => {
              console.error("Could not copy text: ", err);
            });
        }
      });
    }
  }, 500); // Delay to ensure DOM is loaded
}
