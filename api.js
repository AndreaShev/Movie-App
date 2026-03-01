const BASE_URL = "https://omdbapi.com";
const API_KEY = "2e380f8c";

function getMovies(searchQuery) {
  return fetch(`${BASE_URL}?s=${searchQuery}&apikey=${API_KEY}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching movies:", error);
      throw error;
    });
}

function getMovie(id) {
  return fetch(`${BASE_URL}?i=${id}&apikey=${API_KEY}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching movie:", error);
      throw error;
    });
}
