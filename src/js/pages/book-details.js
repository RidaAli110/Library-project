import { Navbar } from '../components/navbar.js';
import { getBookDetails, displayBookEditionInfo } from '../api/open-library.js';
import { displayBookDescription } from '../utils/book-description.js';
import fetchAndDisplayAuthors from '../utils/displayAuthorInfo.js';
import {
  handleSavedBook,
  updateSaveButtonText,
} from '../utils/Save-to-my-library-button.js';
import { hideLoading, showLoading } from '../components/loading.js';
import { showAPIerror } from '../components/api-error-state.js';

/*---------------------------------------Variables---------------------------------------*/
const loadingWrapper = document.querySelector('.loading-wrapper');
const pageContainer = document.querySelector('.page-container');
const bookImg = document.querySelector('.book-details-img');
const bookTitle = document.querySelector('.book-title');
const nameOfAuthor = document.querySelector('.author-text');
const desc = document.querySelector('.desc-text');
const pages = document.querySelector('.pages');
const publishDate = document.querySelector('.publish-date');
const publisher = document.querySelector('.publisher');
const topicListContainer = document.querySelector('.topic-list');
const saveBtn = document.querySelector('.save-btn');

/*---------------------------------------Navbar render---------------------------------------*/
document.querySelector('#nav-bar').append(Navbar('book-details'));

/*---------------------------------------Go back button---------------------------------------*/
const backBtn = document.querySelector('.back-btn');
backBtn?.addEventListener('click', () => {
  if (history.length > 1) {
    history.back();
  } else {
    window.location.href = '/index.html';
  }
});

/*----------------------------------Display Book Information----------------------------------*/
async function displayBookDetails() {
  const params = new URLSearchParams(window.location.search);
  const bookKey = params.get('key');

  let bookDetails;

  const message = 'Loading Book...';
  showLoading(loadingWrapper, message);
  try {
    bookDetails = await getBookDetails(bookKey);

    if (bookDetails === undefined) {
      throw new Error('Failed to fetch book');
    }

    pageContainer.style.display = 'block';
  } catch (error) {
    showAPIerror(loadingWrapper, displayBookDetails);
    return;
  } finally {
    hideLoading(loadingWrapper);
  }

  if (!bookDetails) {
    return;
  }

  document.title = bookDetails.title;

  if (bookDetails.covers?.length) {
    bookImg.src = `https://covers.openlibrary.org/b/id/${bookDetails.covers[0]}-L.jpg`;
  } else {
    bookImg.src = '/assets/images/No-Image-Placeholder.svg.webp';
  }
  bookImg.onerror = () => {
    bookImg.src = '/assets/images/No-Image-Placeholder.svg.webp';
  };

  bookTitle.textContent = bookDetails.title || 'No Title Available';
  displayBookDescription(bookDetails.description, desc);
  fetchAndDisplayAuthors(bookDetails.authors, nameOfAuthor);
  displayTopics(bookDetails.subjects);
  displayBookEditionInfo(bookDetails.key, pages, publishDate, publisher);

  const msg = 'Remove from Library';
  updateSaveButtonText(saveBtn, bookDetails, msg);
  handleSavedBook(saveBtn, bookDetails, msg);
}

/*--------------------Topics List-------------------- */
function displayTopics(subjects) {
  if (!subjects || subjects.length === 0) {
    noTopicsMsg();
    return;
  }

  const filteredSubjects = subjects?.filter((subject) => {
    return subject.length < 20;
  });

  if (filteredSubjects.length === 0) {
    noTopicsMsg();
    return;
  }

  const subjectList = filteredSubjects?.slice(0, 3);
  subjectList?.forEach((topic) => {
    const li = document.createElement('li');
    li.classList.add('topic-li');
    li.textContent = topic;
    topicListContainer.appendChild(li);
  });
}

function noTopicsMsg() {
  const p = document.createElement('p');
  p.classList.add('no-info-topics');
  p.textContent = 'No topics information available';
  topicListContainer.appendChild(p);
}
displayBookDetails();
