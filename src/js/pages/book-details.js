import { Navbar } from '../components/navbar.js';
import { getBookDetails, displayBookEditionInfo } from '../api/open-library.js';
import { displayBookDescription } from '../utils/book-description.js';
import fetchAndDisplayAuthors from '../utils/displayAuthorInfo.js';
import {
  handleSavedBook,
  updateSaveButtonText,
} from '../utils/Save-to-my-library-button.js';

/*-------------------------------------------Variables-------------------------------------------*/
const bookImg = document.querySelector('.book-details-img');
const bookTitle = document.querySelector('.book-title');
const nameOfAuthor = document.querySelector('.author-text');
const desc = document.querySelector('.desc-text');
const pages = document.querySelector('.pages');
const publishDate = document.querySelector('.publish-date');
const publisher = document.querySelector('.publisher');
const topicListContainer = document.querySelector('.topic-list');
const saveBtn = document.querySelector('.save-btn');

/*------------------------------------------Navbar render------------------------------------------*/
document.querySelector('#nav-bar').append(Navbar('book-details'));

/*------------------------------------------Go back button------------------------------------------*/
// This lets the user go back to the page they were last
const backBtn = document.querySelector('.back-btn');
backBtn?.addEventListener('click', () => {
  if (history.length > 1) {
    history.back();
  } else {
    window.location.href = '/index.html';
  }
});

/*---------------------------------------Display Book Information---------------------------------------*/
async function displayBookDetails() {
  const params = new URLSearchParams(window.location.search);
  const bookKey = params.get('key');
  const results = await getBookDetails(bookKey);
  console.log(results);

  if (!results) {
    return;
  }

  document.title = results.title;

  // Add details to page
  if (results.covers?.length) {
    bookImg.src = `https://covers.openlibrary.org/b/id/${results.covers[0]}-L.jpg`;
  } else {
    bookImg.src = '/assets/images/No-Image-Placeholder.svg.webp';
  }
  bookImg.onerror = () => {
    bookImg.src = '/assets/images/No-Image-Placeholder.svg.webp';
  };

  bookTitle.textContent = results.title || 'No Title Available';
  displayBookDescription(results.description, desc);
  fetchAndDisplayAuthors(results.authors, nameOfAuthor);
  displayTopics(results.subjects);
  displayBookEditionInfo(results.key, pages, publishDate, publisher);

  // ---Save to my library button---
  // On first load update save button text base on if it is saved already
  const msg = 'Remove from Library'
  updateSaveButtonText(saveBtn, results, msg);
  // Add event listener to the save button of each book card
  handleSavedBook(saveBtn, results);
}

/*--------------------Topics List-------------------- */
function displayTopics(subjects) {
  // Fallback for when there are no subjects
  if (!subjects || subjects.length === 0) {
    const p = document.createElement('p');
    p.classList.add('no-info-topics');
    p.textContent = 'No topics information available';
    topicListContainer.appendChild(p);
    return;
  }

  // Filter subjects to return topics less than 20 letters
  const filteredSubjects = subjects?.filter((subject) => {
    return subject.length < 20;
  });

  if (filteredSubjects.length === 0) {
    const p = document.createElement('p');
    p.classList.add('no-info-topics');
    p.textContent = 'No topics information available';
    topicListContainer.appendChild(p);
    return;
  }

  // Select first 3 subjects and display on page
  const subjectList = filteredSubjects?.slice(0, 3);
  subjectList?.forEach((topic) => {
    const li = document.createElement('li');
    li.classList.add('topic-li');
    li.textContent = topic;
    topicListContainer.appendChild(li);
  });
}

displayBookDetails();
