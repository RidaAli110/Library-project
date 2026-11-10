import {
  loadSavedBooks,
  removeBookFromLocalStorage,
} from '../utils/save-to-books.js';
import fetchAndDisplayAuthors from '../utils/displayAuthorInfo.js';
import { Navbar } from '../components/navbar.js';

/*---------------------------------------------Variables---------------------------------------------*/
const emptyState = document.querySelector('.empty-state-hidden');
const savedBooksSection = document.querySelector('.saved-book-section');
const savedBooksList = document.getElementById('saved-books-grid');
const input = document.getElementById('saved-book-search');
const clearBtn = document.querySelector('.clear-search');

/*-------------------------------------------Event Listeners-------------------------------------------*/
savedBooksList.addEventListener('click', removeBook);
input.addEventListener('input', searchSavedBooks);
clearBtn.addEventListener('click', clearInput);

/*-------------------------------------------Navbar render-------------------------------------------*/
document.querySelector('#nav-bar').append(Navbar('my-library'));

/*-------------------------------------------My Saved Books-------------------------------------------*/
const mySavedBooks = loadSavedBooks();

/*--------------------------------Check saved books to show empty state--------------------------------*/
function checkBooks() {
  if (mySavedBooks.length === 0) {
    emptyState.hidden = false;
    savedBooksSection.hidden = true;
    return;
  }

  emptyState.hidden = true;
  savedBooksSection.hidden = false;
}

checkBooks();

/*-------------------------------------------Display Saved Books-------------------------------------------*/
function displaySavedBooks(booksArray) {
  savedBooksList.innerHTML = '';

  booksArray.forEach(async (book) => {
    // -----Book card-----
    const li = document.createElement('li');
    li.classList.add('saved-book-card');
    // Add dataset to use later to identify which book was removed
    li.dataset.key = book.key;

    // -----Book cover-----
    const img = document.createElement('img');
    img.classList.add('saved-book-img');
    img.src = `https://covers.openlibrary.org/b/id/${book.covers?.[0] ?? book.cover_id}-M.jpg`;
    img.alt = '';
    img.onerror = () => {
      img.onerror = null;
      img.src = '/assets/images/No-Image-Placeholder.svg.webp';
    };

    // -----Book details div-----
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('saved-details');
    // Title
    const title = document.createElement('p');
    title.classList.add('title-text');
    title.textContent = book.title || 'No Title Available';

    // Author Name
    const authorName = document.createElement('p');
    authorName.classList.add('author-text');
    detailsDiv.append(title, authorName);

    // -----Buttons div-----
    const btnsDiv = document.createElement('div');
    btnsDiv.classList.add('saved-books-btns');
    // View book button
    const viewBtn = document.createElement('a');
    viewBtn.classList.add('view-book-btn');
    viewBtn.href = `/src/pages/book-details.html?key=${book.key}`;
    viewBtn.textContent = 'View Book';
    // Remove book button
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove');
    removeBtn.textContent = 'Remove';
    btnsDiv.append(viewBtn, removeBtn);

    li.append(img, detailsDiv, btnsDiv);
    savedBooksList.appendChild(li);

    // Fetch authors after appending so the books can appear first in the DOM.
    await fetchAndDisplayAuthors(book.authors, authorName);

    // Set aria-labels after author information is fetched
    viewBtn.setAttribute(
      'aria-label',
      `View details for ${title.textContent} by ${authorName.textContent} `,
    );

    removeBtn.setAttribute(
      'aria-label',
      `Remove ${title.textContent} by ${authorName.textContent} from my library`,
    );
  });
}

displaySavedBooks(mySavedBooks);

/*------------------------------------------------Remove Book------------------------------------------------*/
function removeBook(e) {
  // Identifies the remove button that was clicked
  const removeBtn = e.target.closest('.remove');

  if (removeBtn) {
    // Finds the parent book card
    const bookCard = removeBtn.closest('.saved-book-card');

    // This gets the saved books from local Storage
    const savedBooks = loadSavedBooks();

    // In the local storage array it finds the book that was removed, by using the dataset key
    const bookToRemove = savedBooks.find((savedBook) => {
      return savedBook.key === bookCard.dataset.key;
    });

    if (bookToRemove) {
      // Remove book from DOM
      bookCard.remove();
      // Remove Book from local storage and store return updated array in variable
      const updatedSavedBooks = removeBookFromLocalStorage(bookToRemove);

      // Update mySavedBooks to latest saved book array
      mySavedBooks = updatedSavedBooks;

      // Checks the updated array to determine visibility of empty state
      checkBooks();
    }
  }
}

/*------------------------------------------------Search Saved Books------------------------------------------------*/
function searchSavedBooks(e) {
  const searchTerm = e.target.value.trim().toLowerCase();

  const savedBooks = loadSavedBooks();
  const booksMatchingSearch = savedBooks.filter((book) => {
    return book.title.toLowerCase().includes(searchTerm);
  });
  displaySavedBooks(booksMatchingSearch);

  sessionStorage.setItem('filtered-books', searchTerm);
}

//  Session storage
const savedSearchTerm = sessionStorage.getItem('filtered-books');

input.value = savedSearchTerm || '';

if (savedSearchTerm) {
  const filteredBooks = mySavedBooks.filter((book) => {
    return book.title.toLowerCase().includes(savedSearchTerm);
  });
  displaySavedBooks(filteredBooks);
} else {
  displaySavedBooks(mySavedBooks);
}

function clearInput() {
  input.value = '';
  sessionStorage.setItem('filtered-books', '');
  displaySavedBooks(mySavedBooks);
}

