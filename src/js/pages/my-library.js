import {
  loadSavedBooks,
  removeBookFromLocalStorage,
} from '../utils/save-to-books.js';
import fetchAndDisplayAuthors from '../utils/displayAuthorInfo.js';
import { Navbar } from '../components/navbar.js';

/*---------------------------------------Variables---------------------------------------*/
const emptyState = document.querySelector('.empty-state-hidden');
const savedBooksSection = document.querySelector('.saved-book-section');
const savedBooksList = document.getElementById('saved-books-grid');
const input = document.getElementById('saved-book-search');
const clearBtn = document.querySelector('.clear-search');

/*------------------------------------Event Listeners------------------------------------*/
savedBooksList.addEventListener('click', removeBook);
input.addEventListener('input', searchSavedBooks);
input.addEventListener('input', toggleClearBtn);
clearBtn.addEventListener('click', clearInput);

/*--------------------------------------Navbar render--------------------------------------*/
document.querySelector('#nav-bar').append(Navbar('my-library'));

/*-------------------------------Load Books From localStorage-------------------------------*/
let mySavedBooks = loadSavedBooks();

/*----------------------------------------Empty State Check----------------------------------------*/
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

/*--------------------------------------Display Saved Books--------------------------------------*/
function displaySavedBooks(booksArray) {
  savedBooksList.innerHTML = '';

  booksArray.forEach(async (book) => {
    const li = document.createElement('li');
    li.classList.add('saved-book-card');
    // Add dataset to identify which book was removed.
    li.dataset.key = book.key;

    const img = document.createElement('img');
    img.classList.add('saved-book-img');
    img.src = `https://covers.openlibrary.org/b/id/${book.covers?.[0] ?? book.cover_id}-M.jpg`;
    img.alt = '';
    img.onerror = () => {
      img.onerror = null;
      img.src = '/assets/images/No-Image-Placeholder.svg.webp';
    };

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('saved-details');

    const title = document.createElement('p');
    title.classList.add('title-text');
    title.textContent = book.title || 'No Title Available';

    const authorName = document.createElement('p');
    authorName.classList.add('author-text');
  
    detailsDiv.append(title, authorName);


    // -----Buttons div-----
    const btnsDiv = document.createElement('div');
    btnsDiv.classList.add('saved-books-btns');
    
    const viewBtn = document.createElement('a');
    viewBtn.classList.add('view-book-btn');
    viewBtn.href = `/src/pages/book-details.html?key=${book.key}`;
    viewBtn.textContent = 'View Book';
    
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove');
    removeBtn.textContent = 'Remove';

    btnsDiv.append(viewBtn, removeBtn);


    li.append(img, detailsDiv, btnsDiv);
    savedBooksList.appendChild(li);

    // Fetch authors after appending so the books can appear first on the page
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

/*-------------------------------------------Remove Book-------------------------------------------*/
function removeBook(e) {
  const removeBtn = e.target.closest('.remove');

  if (removeBtn) {
    const bookCard = removeBtn.closest('.saved-book-card');

    const savedBooks = loadSavedBooks();

    //  finds the book that was removed, by using the dataset key
    const bookRemoved = savedBooks.find((savedBook) => {
      return savedBook.key === bookCard.dataset.key;
    });

    if (bookRemoved) {
      bookCard.remove();
      const updatedSavedBooks = removeBookFromLocalStorage(bookRemoved);

      // Update mySavedBooks to latest saved book array
      mySavedBooks = updatedSavedBooks;

      checkBooks();
    }
  }
}

/*-----------------------------------------Search Saved Books-----------------------------------------*/
function searchSavedBooks(e) {
  const searchTerm = e.target.value.trim().toLowerCase();

  const savedBooks = loadSavedBooks();

  const booksMatchingSearch = savedBooks.filter((book) => {
    return book.title.toLowerCase().includes(searchTerm);
  });
  displaySavedBooks(booksMatchingSearch);

  // Save the search term to session storage
  sessionStorage.setItem('filtered-books', searchTerm);
}

const savedSearchTerm = sessionStorage.getItem('filtered-books');

input.value = savedSearchTerm || '';
toggleClearBtn();


if (savedSearchTerm) {
  const filteredBooks = mySavedBooks.filter((book) => {
    return book.title.toLowerCase().includes(savedSearchTerm);
  });
  displaySavedBooks(filteredBooks);
} else {
  displaySavedBooks(mySavedBooks);
}

function toggleClearBtn() {
  clearBtn.classList.toggle('visible', input.value.length > 0);
}

function clearInput() {
  input.value = '';
  toggleClearBtn();
  sessionStorage.setItem('filtered-books', '');
  displaySavedBooks(mySavedBooks);
}
