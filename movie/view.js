const movieNode = document.querySelector('#movie');

function render(movie){
    const {
        Title
    } = movie;

movieNode.innerHTML = `
  <div>
  <h1>${Title}</h1>
  </div>
`;
}