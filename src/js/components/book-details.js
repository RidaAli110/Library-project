import { Navbar } from './navbar.js';
import { getBookDetails } from '../api/open-library.js';
import { displayBookDescription } from "../../utils/book-description.js";
/*----------------------------Variables----------------------------*/
const URL = 'https://openlibrary.org';
const bookImg = document.querySelector('.book-details-img');
const bookTitle = document.querySelector('.book-title');
const nameOfAuthor = document.querySelector('.author-text');
const desc = document.querySelector('.desc-text');
const pages = document.querySelector('.pages');
const publishDate = document.querySelector('.publish-date');
const publisher = document.querySelector('.publisher');
const topicListContainer = document.querySelector('.topic-list');

/*----------------------------Navbar render----------------------------*/
document.querySelector('#nav-bar').append(Navbar('book-details'));

/*----------------------------Go back button----------------------------*/
// This lets the user go back to the page they were last
const backBtn = document.querySelector('.back-btn');
backBtn?.addEventListener('click', () => {
  if (history.length > 1) {
    history.back();
  } else {
    window.location.href = '/index.html';
  }
});

/*---------------------------------Display Book Information---------------------------------*/
async function displayBookDetails() {
  const params = new URLSearchParams(window.location.search);
  const bookKey = params.get('key');
  const results = await getBookDetails(bookKey);
  console.log(results);

  if (!results) {
    return;
  }

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
  displayAuthor(results.authors);
  displayTopics(results.subjects);
  displayBookEditionInfo(results.key);
}

/*--------------------Author Name-------------------- */
async function displayAuthor(authorId) {
  // Array that holds the authors names
  const names = [];

  if (authorId.length < 1) {
    nameOfAuthor.textContent = 'Author information unavailable';
    return;
  } else {
    // Loop through the array of authorId's and use the author keys to fetch the authors names
    for (let author of authorId) {
      const authorNames = await fetchAuthor(author.author.key);
      // Push the authors names to the names array
      names.push(authorNames.name);
    }
  }
  // Display the authors names from the names array and if there is more than one name add '-' between.
  nameOfAuthor.textContent = names.join(' - ');
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

/*----------------Book Edition Information---------------- */
async function displayBookEditionInfo(key) {
  // Get the array of entries containing editions and their keys
  const editionKey = await fetchEditionKey(key);

  // Filter the entries to return the ones that are in english
  const englishEdition = editionKey.filter((edition) => {
    return edition.languages?.some(
      (language) => language.key === '/languages/eng',
    );
  });

  if (!englishEdition) {
    return;
  }

  // returns an array containing the earliest editions
  englishEdition.sort((a, b) => {
    return getPublishYear(a.publish_date) - getPublishYear(b.publish_date);
  });

  // Selects the first edition
  const earliestEdition = englishEdition[0];

  // Fetch's the edition details using the earliest editions key.
  const editionDetails = await fetchEditionDetails(earliestEdition.key);

  // Display the information returned
  pages.textContent = editionDetails.number_of_pages || 'Not available';
  publishDate.textContent = formatPublishDate(editionDetails.publish_date);
  publisher.textContent =
    editionDetails.publishers.join(' - ') || 'Not available';
}

/*---------------------------------Fetch Author details---------------------------------*/
async function fetchAuthor(authorKey) {
  try {
    const res = await fetch(`${URL}${authorKey}.json`);
    if (!res.ok) {
      throw new Error('Failed to fetch author data');
    }
    const authorData = await res.json();
    return authorData;
  } catch (error) {
    console.error(error);
  }
}
displayBookDetails();

/*---------------------------------Fetch edition key using the book workKey---------------------------------*/
async function fetchEditionKey(workKey) {
  try {
    const res = await fetch(
      `${URL}${workKey}/editions.json?limit=100&offset=0`,
    );

    if (!res.ok) {
      throw new Error('Failed to fetch');
    }

    const data = await res.json();
    console.log(data.entries);
    return data.entries;
  } catch (error) {
    console.error(error);
  }
}

/*---------------------------------Fetch edition details using the edition key---------------------------------*/
async function fetchEditionDetails(editionKey) {
  try {
    const res = await fetch(`${URL}${editionKey}.json`);

    if (!res.ok) {
      throw new Error('Failed to fetch edition Information');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

/*-----Get publication year. Code from chatGPT----- */
function getPublishYear(date) {
  if (!date) return Infinity;
  const year = date.match(/\b\d{4}\b/);

  return year ? Number(year[0]) : Infinity;
}

/* Logic behind fetching a books edition info.
1. To get a books edition info you need a edition key. to get the edition key I used the workKey from the books results to fetch a array of entries that contain many editions in different languages and publish dates. 
2. I selected a edition that was in English and the earliest edition. The API does not provide a original edition.
3. Once I selected the earliest edition I used the edition key to fetch the editions info that contained number of pages, date published etc. And displayed the data.
*/

/*---------------------------------Format date---------------------------------*/
// Code from chatGPT
function formatPublishDate(dateString) {
  if (!dateString) return 'Not available';

  // Keep year-only dates
  if (/^\d{4}$/.test(dateString.trim())) {
    return dateString.trim();
  }

  // Convert the date string into a JavaScript Date object
  const date = new Date(dateString);

  // Check whether JavaScript could understand the date
  // If it couldn't, return the original value instead of displaying an invalid date
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  // Format the date into british conventions
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
  }).format(date);
}
