import { handleSavedBook, updateSaveButtonText } from '../utils/Save-to-my-library-button.js';
import { getGenreBooks } from '../api/open-library.js';
import { Navbar } from '../components/navbar.js';

/*---------------------------------------------Variables---------------------------------------------*/
const genreTitle = document.querySelector('.results-h1');
const resultsUl = document.querySelector('#results-grid');

/*-------------------------------------------Navbar render-------------------------------------------*/
document.querySelector('#nav-bar').append(Navbar('genre-results'));

/*-------------------------------------------Explore Genres-------------------------------------------*/
const searchParams = new URLSearchParams(window.location.search);
const selectedGenre = searchParams.get('genre');
const formattedGenre = selectedGenre
  .replaceAll('_', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

/*--------------------------------------Displaying Genre Books-------------------------------------- */
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

  document.title = formattedGenre;
  
  genreBooks.forEach((book) => {
    genreTitle.textContent = `Results for ${formattedGenre}`;

    const li = createGenreBookCard(book);

    resultsUl.appendChild(li);
  });
}
displayGenreBooks();

/*--------------------------------------Create Genre Book Card-------------------------------------- */
function createGenreBookCard(book) {
  // List element
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

  // Title
  const title = document.createElement('p');
  title.classList.add('book-title');
  title.textContent = book.title;

  // View book button
  const viewBtn = document.createElement('a');
  viewBtn.href = `/src/pages/book-details.html?key=${book.key}`;
  viewBtn.setAttribute('aria-label', `View details for ${book.title}`);
  viewBtn.classList.add('view-result-btn');
  viewBtn.textContent = 'View Book';

  // Save book button
  const saveBtn = document.createElement('button');
  saveBtn.setAttribute('aria-label', `Save ${book.title} to my library`);
  saveBtn.classList.add('save');
  saveBtn.textContent = 'Save Book';
  // On first load update save button text base on if it is saved already
  const msg = 'Remove'
  updateSaveButtonText(saveBtn, book, msg);
  // Add event listener to the save button of each book card
  handleSavedBook(saveBtn, book, msg);

  li.append(img, title, viewBtn, saveBtn);
  return li;
}


