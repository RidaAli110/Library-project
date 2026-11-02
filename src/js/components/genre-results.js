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
    li.innerHTML = `<img
    class="book-result-img"
    src= 'https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg'
     onerror="this.onerror=null; this.src='/assets/images/no-cover.png';"
    alt="Cover of ${book.title}"
    />
    <div>
    <p class="result-text book-title">${book.title}</p>
    </div>
    <a href="/src/pages/book-details.html?key=${book.key}"
    aria-label="View details for ${book.title}"
    class="view-result-btn" >View Book</a>`;
    genreTitle.textContent = `Results for ${formattedGenre} `;
    resultsUl.appendChild(li);
  });
}

displayGenreBooks();
