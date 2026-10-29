import { Navbar } from './navbar.js';
import { getBookDetails } from '../api/open-library.js';
/*----------------------------Variables----------------------------*/
const URL = 'https://openlibrary.org';
const bookImg = document.querySelector('.book-details-img');
const bookTitle = document.querySelector('.book-title');
const authorText = document.querySelector('.author-text');
const desc = document.querySelector('.desc-text');
const pages = document.querySelector('.pages');
const publishDate = document.querySelector('.publish-date');
const publisher = document.querySelector('.publisher');
const topicListContainer = document.querySelector('.topic-list');

/*----------------------------Navbar render----------------------------*/
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

/*---------------------------------Display Book Information---------------------------------*/
export async function displayBookDetails() {
  console.log('Function is running!');
  const params = new URLSearchParams(window.location.search);
  const bookKey = params.get('key');
  const results = await getBookDetails(bookKey);
  console.log(results);

  if (!results) {
    return;
  }
  // Displaying book information
  bookImg.src = `https://covers.openlibrary.org/b/id/${results.covers[0]}-L.jpg`;
  bookTitle.textContent = results.title;

  //Description
  const description = results.description;
  // checking if it's a string
  if (typeof description === 'string') {
    desc.textContent = description;
  }
  // Checking if its a object
  else if (typeof description === 'object') {
    desc.textContent = description.value;
  } else {
    // If theres no description available
    desc.textContent = 'No description available';
  }

  //Author name
  const authorNames = results.authors;
  const names = [];
  if (authorNames.length < 1) {
    authorText.textContent = 'Author information unavailable';
    return;
  } else {
    for (let author of authorNames) {
      const authorNameList = await fetchAuthor(author.author.key);
      console.log(authorNameList.name);
      names.push(authorNameList.name);
      console.log(names);
    }
  }
  authorText.textContent = names.join(' - ');

  // Topics list
  if (results.subjects.length < 1) {
    topicLi.style.display = 'none';
    const p = document.createElement('p');
    p.classList.add('no-info-topics');
    p.textContent = 'No topics information available';
    topicListContainer.appendChild(p);
  }
  const subjects = results.subjects.filter((subject, index) => {
    return subject.length < 20;
  });
  const subjectList = subjects.slice(0, 3);
  subjectList.forEach((topic) => {
    const li = document.createElement('li');
    li.classList.add('topic-li');
    li.textContent = topic;
    topicListContainer.appendChild(li);
  });

  // Get Edition info and display book edition details
  const editionKey = await fetchEditionKey(results.key);

  const rightEdition = editionKey.find((edition) => {
    if (!edition.languages || edition.languages.length < 1) {
      return false;
    }
    return edition.languages.some(
      (language) => language.key === '/languages/eng',
    );
  });

  if (!rightEdition) {
    return;
  }

  const editionDetails = await fetchEditionDetails(rightEdition.key);
  console.log(editionDetails);
  pages.textContent = editionDetails.number_of_pages || 'Not available';
  publishDate.textContent = formatPublishDate(editionDetails.publish_date);
  publisher.textContent = editionDetails.publishers || 'Not available';
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
    const res = await fetch(`${URL}${workKey}/editions.json`);

    if (!res.ok) {
      throw new Error('Failed to fetch');
    }

    const data = await res.json();
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
