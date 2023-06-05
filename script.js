const API_KEY = '1f5cf6b2dad76a16dd37509297226c0a';
let currentPage = 1;
let totalPages = 1;

const searchInput = document.getElementById('search-input');
const moviesContainer = document.getElementById('movies');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('movie-details');
const modalClose = document.getElementById('modal-close');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

function renderMovie(movie) {
  const card = document.createElement('div');
  card.classList.add('card');
  const cardImage= document.createElement('div');
  cardImage.classList.add('card-image');
  const poster = document.createElement('img');

  if (movie.poster_path) {
    poster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
    poster.alt = movie.title;
  } else {
    // Use a default image from your directory
    poster.src = 'No-image.png';
    poster.alt = ''; // Leave alt attribute empty if using a default image
  }

  const title = document.createElement('div');
  title.classList.add('title');
  title.textContent = movie.title;

  const rating = document.createElement('div');
  rating.classList.add('rating');
  rating.textContent = `⭐ ${movie.vote_average.toFixed(1)}`;

  cardImage.appendChild(poster);
  cardImage.appendChild(rating);
  card.appendChild(cardImage);
  card.appendChild(title);

  

  card.addEventListener('click', () => {
    showModal(movie);
  });

  moviesContainer.appendChild(card);
}

function fetchMovies(query, page) {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`;

    if (query) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`;
    }
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const movies = data.results;
        moviesContainer.innerHTML = '';
  
        movies.forEach((movie) => {
          renderMovie(movie);
        });
  
        totalPages = data.total_pages;
  
        // Enable/disable previous and next buttons based on current page
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
      })
      .catch((error) => {
        console.log('Error fetching movies:', error);
      });
}

function filterMovies(query) {
  currentPage = 1;
  fetchMovies(query, currentPage);
}

function showModal(movie) {
  const poster = document.createElement('img');
  poster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
  poster.alt = movie.title;
  const movieData=document.createElement('div');
  movieData.classList.add("movie-data");

  const title = document.createElement('h2');
  title.textContent = movie.title;

  const description = document.createElement('div');
  description.classList.add("overview");
  description.textContent = movie.overview;

  const rating = document.createElement('div');
  rating.classList.add("rating");
  rating.textContent = `⭐ ${movie.vote_average.toFixed(1)}`;

  modalContent.innerHTML = '';
  modalContent.appendChild(poster);
  modalContent.appendChild(movieData);
  movieData.appendChild(title);
  movieData.appendChild(rating);
  movieData.appendChild(description);
 

  modal.style.display = 'block';
}

searchInput.addEventListener('input', (event) => {
  const query = event.target.value;
  if (query.length > 2) {
    filterMovies(query);
  } else {
    fetchMovies('', currentPage);
  }
});

modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

prevButton.addEventListener('click', () => {
  currentPage--;
  const query = searchInput.value;
  fetchMovies(query, currentPage);
});

nextButton.addEventListener('click', () => {
  currentPage++;
  const query = searchInput.value;
  fetchMovies(query, currentPage);
});

fetchMovies('', currentPage);

const hamburgerMenu = document.querySelector('.hamburger-menu');
const menu = document.querySelector('.menu-links');

hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('open');
    menu.classList.toggle('open');
});