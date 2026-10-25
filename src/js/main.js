import { Navbar } from './components/navbar.js';
import { getTrendingBooks } from './api/open-library.js';

const trendingList = document.querySelector('.trending-books-container');

const navbarContainer = document.querySelector('#nav-bar');
navbarContainer.append(Navbar('home'));

const books = await getTrendingBooks();
console.log(books);

// Displaying Trending books from API
function displayTrendingBooks() {
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
