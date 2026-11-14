import { Navbar } from '../components/navbar.js';
import {
  getBookDetails,
  getBookOfTheDay,
  getTrendingBooks,
  searchBook,
} from '../api/open-library.js';
import { displayBookDescription } from '../utils/book-description.js';
import { displaySkeleton, hideSkeleton } from '../components/skeleton-ui.js';
import { showAPIerror } from '../components/api-error-state.js';

/*-------------------------------------Variables-------------------------------------*/
const contentWrapper = document.querySelector('.content-wrapper');
const pageContainer = document.querySelector('.page-container');
const trendingList = document.querySelector('.trending-books-container');
const resultsContainer = document.querySelector('#search-results');
const searchWrapper = document.querySelector('.search-input-wrapper');
const input = document.getElementById('book-search');
const clearBtn = document.querySelector('.clear-search');
const searchForm = document.querySelector('.input-container');
const bookOfDayTitle = document.querySelector('.b-o-t-d-title');
const bookOfDayAuthor = document.querySelector('.b-o-t-d-author');
const bookOfDayDesc = document.querySelector('.b-o-t-d-desc');
const bookOfDayImg = document.querySelector('.book-o-t-d-img');
const bookOfDayViewBtn = document.querySelector('.b-o-t-d-view-btn');
const genreLinks = document.querySelectorAll('.genre-list-tags');


/*-------------------------------------Event Listeners-------------------------------------*/
document.addEventListener('click', closeInput);
input.addEventListener('input', searchResults);
input.addEventListener('input', toggleClearBtn);
clearBtn.addEventListener('click', clearInput);
searchForm.addEventListener('submit', searchSubmit);
genreLinks.forEach((link) => {
  link.addEventListener('click', handleGenreClick);
});

/*-----------------------------------------Navbar render-----------------------------------------*/
const navbarContainer = document.querySelector('#nav-bar');
navbarContainer.append(Navbar('home'));

/*-----------------------------------------Fetch Functions-----------------------------------------*/
let books;
let bookOfDay;

async function loadDashboard() {
  pageContainer.style.display = '';
  const skeletonData = displaySkeleton();

  try {
    books = await getTrendingBooks();

    if (books === undefined) {
      throw new Error('Failed to fetch trending books');
    }

    bookOfDay = await getBookOfTheDay();

    if (bookOfDay === undefined) {
      throw new Error('Failed to fetch Book of the Day');
    }

    displayTrendingBooks();
    displayBookOfTheDay();
  } catch (error) {
    pageContainer.style.display = 'none';
    showAPIerror(contentWrapper, loadDashboard);
  } finally {
    hideSkeleton(skeletonData);
  }
}

loadDashboard();

// Stores the controller so the last search request can be cancelled
let controller;

/* ----------------------------------Displaying Trending Books----------------------------------*/
function displayTrendingBooks() {
  if (!books || books.length === 0) {
    return;
  }

  books.forEach((book) => {
    const li = document.createElement('li');
    li.classList.add('trending-book');

    const bookLink = document.createElement('a');
    bookLink.href = `/src/pages/book-details.html?key=${book.key}`;

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('img-box-shadow');
    const img = document.createElement('img');
    img.classList.add('trending-book-img');
    img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    img.onerror = () => {
      img.onerror = null;
      img.src = '/assets/images/No-Image-Placeholder.svg.webp';
    };
    img.alt = `${book.title} by ${book.author_name}`;
    imgDiv.append(img);

    const title = document.createElement('p');
    title.classList.add('trending-book-title');
    title.textContent = `${book.title}`;

    bookLink.append(imgDiv, title);
    li.appendChild(bookLink);
    trendingList.appendChild(li);
  });
}


/*----------------------------------------Search for a Book----------------------------------------*/
function searchResults(e) {

  // Abort the previous request when a new search starts. also prevents unnecessary requests
  if (controller) {
    controller.abort();
  }

  const userInput = e.target.value.trim();
  if (!userInput) {
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
    return;
  }
  resultsContainer.innerHTML = '';

  performSearch(userInput);
}

/*------Handles Fetch and Display Logic------*/
async function performSearch(inputValue) {
  // Cancels previous requests and checks if the current request was aborted.
  controller = new AbortController();
  const signal = controller.signal;
  const bookResults = await searchBook(inputValue, signal);
  if (signal.aborted) {
    return;
  }

  if (!Array.isArray(bookResults)) {
    resultsContainer.style.display = 'none';
    return;
  }

  if (bookResults.length < 1) {
    resultsContainer.innerHTML = `<p class='no-result'>No books found. Try again.</p>`;
    return;
  }

  if (bookResults.length > 0) {
    resultsContainer.style.display = 'block';
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

    div.append(bookTitle, bookAuthor);

    link.appendChild(div);
    resultsContainer.appendChild(link);
  });

  return bookResults;
}

/*------Handles Form Submission------*/
async function searchSubmit(e) {
  e.preventDefault();
  const inputValue = input.value.trim();
  if (inputValue === '') {
    resultsContainer.innerHTML = '';
    resultsContainer.style.display = 'none';
    return;
  }

  const searchResults = await performSearch(inputValue);
  if (!Array.isArray(searchResults) || searchResults.length < 1) {
    resultsContainer.innerHTML = `<p class='no-result'>No books found. Try again.</p>`;
    return;
  }
  const firstBookResult = searchResults[0];
  window.location.href = `/src/pages/book-details.html?key=${firstBookResult.key}`;
}

function toggleClearBtn() {
  clearBtn.classList.toggle('visible', input.value.length > 0);
}

function clearInput() {
  input.value = '';
  toggleClearBtn();
}

function closeInput(e) {
  if (!searchWrapper.contains(e.target)) {
    resultsContainer.style.display = 'none';
  }
}

window.addEventListener('pageshow', toggleClearBtn);


/*---------------------------------------Display Book Of The Day---------------------------------------*/
async function displayBookOfTheDay() {
  if (!bookOfDay || bookOfDay.length < 1) {
    return;
  }

  bookOfDayImg.src = `https://covers.openlibrary.org/b/id/${bookOfDay.cover_i}-M.jpg`;
  bookOfDayImg.alt = `${bookOfDay.title} by ${bookOfDay.author_name}`;
  bookOfDayImg.onerror = () => {
    bookOfDayImg.onerror = null;
    bookOfDayImg.src = '/assets/images/No-Image-Placeholder.svg.webp';
  };

  bookOfDayTitle.textContent = bookOfDay.title;
  bookOfDayAuthor.textContent = bookOfDay.author_name;
  bookOfDayViewBtn.href = `/src/pages/book-details.html?key=${bookOfDay.key}`;
  const description = await getBookDetails(bookOfDay.key);
  displayBookDescription(description?.description, bookOfDayDesc);
}


/*--------------------------------------------Explore Genres--------------------------------------------*/
function handleGenreClick(e) {
  e.preventDefault();

  const genre = e.currentTarget.dataset.genre;
  const params = new URLSearchParams();
  params.set('genre', genre);

  window.location.href = `/src/pages/genre-results.html?${params}`;
}
