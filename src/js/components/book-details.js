import { Navbar } from './navbar.js';
import { getBookDetails } from '../api/open-library.js';
document.querySelector('#nav-bar').append(Navbar('book-details'));

// This lets the user go back to the page they were last
const backBtn = document.querySelector('.back-btn');
backBtn.addEventListener('click', () => {
  if (history.length > 1) {
    // takes the user 1 step back in browser history
    history.back();
  } else {
    // Fallback if there isn't a page t go back to
    window.location.href = '/index.html';
  }
});

export async function displayBookDetails(e) {
  const params = new URLSearchParams(window.location.search);
  const bookKey = params.get('key');
  const results = await getBookDetails(bookKey);

  if (!Array.isArray(results)) {
    return;
  }

}

