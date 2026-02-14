const searchListNode = document.querySelector('#search-list');

function render(movies){
let html = '';
if(!movies){
    html = 'No movies'
    searchListNode.innerHTML = html;
    return;
}
movies.forEach(movie => {
    const {
        Poster,
        Title,
        Year,
        Type,
        imdbID
    } = movie;

    html += `
    <a href="/movie.html?id=${imdbID}"> 
    <img src=${Poster} />
    <p>${Title}</p>  
    <p>${Year}</p>
    <p>${Type}</p>
    </a>  
    `;
});

searchListNode.innerHTML = html;
}