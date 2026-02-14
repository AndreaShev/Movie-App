const searchInputNode = document.querySelector('#search');
const searchBtnNode = document.querySelector('#search-btn');
searchBtnNode.addEventListener('click', () => {
    const searchQuery = searchInputNode.value;
    if (!searchQuery){
        return;
    }
    getMovies(searchQuery)
    .then(result => {
        const movies = result.Search;
        render(movies);
    })
});