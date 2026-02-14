const BASE_URL = 'https://omdbapi.com';
const API_KEY = '2e380f8c';

function getMovies(searchQuery){
    return fetch('${BASE_URL}?s=${searchQuery}&apiKey=${API_KEY}')
    .then(data => data.json())
}

function getMovie(id){
    return fetch('${BASE_URL}?s=${searchQuery}&apiKey=${API_KEY}')
    .then(data => data.json())
}