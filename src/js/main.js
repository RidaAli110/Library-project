import { Navbar } from './components/navbar.js';
import {
  getBookDetails,
  getBookOfTheDay,
  getTrendingBooks,
  searchBook,
} from './api/open-library.js';
import { displayBookDescription } from '../utils/book-description.js';
/*----------------------------Variables----------------------------*/
const trendingList = document.querySelector('.trending-books-container');
const searchInput = document.getElementById('book-search');
const resultsContainer = document.querySelector('#search-results');
const searchWrapper = document.querySelector('.search-input-wrapper');
const searchForm = document.querySelector('.input-container');
const bookOfDayTitle = document.querySelector('.b-o-t-d-title');
const bookOfDayAuthor = document.querySelector('.b-o-t-d-author');
const bookOfDayDesc = document.querySelector('.b-o-t-d-desc');
const bookOfDayImg = document.querySelector('.book-o-t-d-img');
const bookOfDayViewBtn = document.querySelector('.b-o-t-d-view-btn');
/*----------------------------Navbar render----------------------------*/
const navbarContainer = document.querySelector('#nav-bar');
navbarContainer.append(Navbar('home'));

// Stores the controller so the last search request can be cancelled
let controller;

/* ------------------------Displaying Trending books from API-------------------------*/
const books = await getTrendingBooks();

function displayTrendingBooks() {
  if (!books || books.length === 0) {
    return; // display a state here
  }

  books.forEach((book) => {
    const li = document.createElement('li');
    li.classList.add('trending-book');
    li.innerHTML = `<a href='/src/pages/book-details.html?key=${book.key}'>
    <div class='img-box-shadow'>
    <img
     class="trending-book-img"
     src= "https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg"
     alt = '${book.title} by ${book.author_name}' />
    </div>
    <p class="trending-book-title">${book.title}</p> </a>`;

    trendingList.appendChild(li);
  });
}
displayTrendingBooks();

/*------------------------------Search for a book------------------------------ */
function searchResults(e) {
  // Abort the previous request when a new search starts. also prevents unnecessary requests
  if (controller) {
    controller.abort();
  }
  //Handles Input
  const userInput = e.target.value.trim();
  if (!userInput) {
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
    return;
  }
  resultsContainer.innerHTML = '';
  resultsContainer.style.display = 'block';

  performSearch(userInput);
}

// Handles fetch and display logic
async function performSearch(inputValue) {
  // Creates a new controller for the current search request
  controller = new AbortController();

  // Save this request's signal so we can check whether it was cancelled
  const signal = controller.signal;

  // Pass the signal to searchBook so fetch can be cancelled
  const bookResults = await searchBook(inputValue, signal);

  // If the current request is cancelled it will stop the function
  if (signal.aborted) {
    return;
  }

  // This checks if the search results are an array before displaying the results
  if (!Array.isArray(bookResults)) {
    resultsContainer.style.display = 'none';
    return;
  }

  // If there's no results then it will display a message and exit the function
  if (bookResults.length < 1) {
    resultsContainer.innerHTML = `<p class='no-result'>No books found. Try again.</p>`;
    return;
  }

  bookResults.forEach((result) => {
    const link = document.createElement('a');
    link.href = `/src/pages/book-details.html?key=${result.key}`;
    link.classList.add('search-result');

    const div = document.createElement('div');

    const bookTitle = document.createElement('h3');
    bookTitle.textContent = result.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = result.author_name
      ? result.author_name.join(', ')
      : 'Unknown author';

    div.appendChild(bookTitle);
    div.appendChild(bookAuthor);

    link.appendChild(div);
    resultsContainer.appendChild(link);
  });

  return bookResults;
}

async function searchSubmit(e) {
  e.preventDefault();
  const searchInputValue = searchInput.value.trim();
  if (searchInputValue === '') {
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
    return;
  }

  const results = await performSearch(searchInputValue);
  if (!Array.isArray(results) || results.length < 1) {
    return;
  }
  const firstBook = results[0];
  window.location.href = `/src/pages/book-details.html?key=${firstBook.key}`;
}

/* -------------------Closes the search results when clicked outside the input------------------- */
function closeInput(e) {
  if (!searchWrapper.contains(e.target)) {
    resultsContainer.style.display = 'none';
  }
}

/* -------------------------------Display Book Of The Day------------------------------- */
async function displayBookOfTheDay() {
  const bookOfDay = await getBookOfTheDay();
  if (!bookOfDay || bookOfDay.length < 1) {
    return;
  }

  // Displaying Book of the day details
  bookOfDayImg.src = `https://covers.openlibrary.org/b/id/${bookOfDay.cover_i}-M.jpg`;
  bookOfDayTitle.textContent = bookOfDay.title;
  bookOfDayAuthor.textContent = bookOfDay.author_name;
  bookOfDayViewBtn.href = `/src/pages/book-details.html?key=${bookOfDay.key}`;
  const bookOfDayDetails = await getBookDetails(bookOfDay.key);
  displayBookDescription(bookOfDayDetails.description, bookOfDayDesc);
}
displayBookOfTheDay();
/*----------------Event listeners----------------*/
searchInput.addEventListener('input', searchResults);
searchForm.addEventListener('submit', searchSubmit);
document.addEventListener('click', closeInput);
