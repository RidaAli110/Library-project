import { getGenreBooks } from '../api/open-library.js';
import { Navbar } from './navbar.js';

/*---------------------------------Variables---------------------------------*/
const genreTitle = document.querySelector('.results-h1');
const resultsUl = document.querySelector('#results-grid');

/*---------------------------------Navbar render---------------------------------*/
document.querySelector('#nav-bar').append(Navbar('genre-results'));

/*--------------------------------------Explore Genres--------------------------------------*/
const searchParams = new URLSearchParams(window.location.search);
const selectedGenre = searchParams.get('genre');
const formattedGenre = selectedGenre
  .replaceAll('_', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

/*--------------------Displaying Books-------------------- */
async function displayGenreBooks() {
  if (selectedGenre === null) {
    genreTitle.textContent = `Something Went wrong. Please try again`;
    return;
  }

  // Genre Books Array
  const genreBooks = await getGenreBooks(selectedGenre);

  if (!genreBooks || genreBooks.length < 1) {
    genreTitle.textContent = 'No results found. Try again.';
    return;
  }
  
  genreBooks.forEach((book) => {
    const li = document.createElement('li');
    li.classList.add('results-card');

    // Book cover
    const img = document.createElement('img');
    img.classList.add('book-result-img');
    img.src = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;
    img.alt = `Cover of ${book.title}`;
    img.onerror = () => {
      img.onerror = null;
      img.src = '/assets/images/No-Image-Placeholder.svg.webp';
    };

    // Details div
    const detailsDiv = document.createElement('div');

    // Title
    const title = document.createElement('p');
    title.classList.add('book-title');
    title.textContent = book.title;

    detailsDiv.appendChild(title);

    // View book button
    const viewBtn = document.createElement('a');
    viewBtn.href = `/src/pages/book-details.html?key=${book.key}`;
    viewBtn.setAttribute('aria-label', `View details for ${book.title}`);
    viewBtn.classList.add('view-result-btn');
    viewBtn.textContent = 'View Book';

    genreTitle.textContent = `Results for ${formattedGenre}`;

    li.append(img, detailsDiv, viewBtn);
    resultsUl.appendChild(li);
  });
}

displayGenreBooks();
