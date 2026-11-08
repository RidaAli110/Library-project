'use strict';
const API_URL = 'https://openlibrary.org';
import { getPublishYear, formatPublishDate } from "../../utils/date-utils.js";

/*---------------------------------------------- Get Trending Books----------------------------------------------*/
export async function getTrendingBooks() {
  try {
    const res = await fetch(`${API_URL}/trending/weekly.json?limit=16`);

    if (!res.ok) {
      throw new Error('failed to fetch trending books');
    }

    const data = await res.json();
    return data.works;
  } catch (error) {
    console.error(error);
  }
}

/*----------------------------------------------Search for books----------------------------------------------*/
export async function searchBook(book, signal) {
  try {
    const res = await fetch(
      `${API_URL}/search.json?q=${encodeURIComponent(book)}&limit=5`,
      { signal },
    );
    if (!res.ok) {
      throw new Error('Failed to fetch search result');
    }
    const data = await res.json();
    return data.docs;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(error);
    }
  }
}

/*-------------------------------------------Fetch Author details-------------------------------------------*/
export async function fetchAuthor(authorKey) {
  try {
    const res = await fetch(`${API_URL}${authorKey}.json`);
    if (!res.ok) {
      throw new Error('Failed to fetch author data');
    }
    const authorData = await res.json();
    return authorData;
  } catch (error) {
    console.error(error);
  }
}

/*----------------------------------------------Get Book Details----------------------------------------------*/
export async function getBookDetails(key) {
  try {
    const res = await fetch(`${API_URL}${key}.json`);
    if (!res.ok) {
      throw new Error('Failed to fetch book details');
    }

    const bookDetails = await res.json();
    return bookDetails;
  } catch (error) {
    console.error(error);
  }
}

/*------------------------------------------Book Edition Information------------------------------------------*/
export async function displayBookEditionInfo(key, pages, publishDate, publisher) {
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
  console.log(editionDetails);
  // Display the information returned
  pages.textContent = editionDetails.number_of_pages || 'Not available';
  publishDate.textContent = formatPublishDate(editionDetails.publish_date);
  publisher.textContent =
    editionDetails.publishers?.join(' - ') || 'Not available';
}


/*-----------------------------------Fetch edition key using the book workKey-----------------------------------*/
export async function fetchEditionKey(workKey) {
  try {
    const res = await fetch(
      `${API_URL}${workKey}/editions.json?limit=200&offset=0`,
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
export async function fetchEditionDetails(editionKey) {
  try {
    const res = await fetch(`${API_URL}${editionKey}.json`);

    if (!res.ok) {
      throw new Error('Failed to fetch edition Information');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

/* Logic behind fetching a books edition info.
1. To get a books edition info you need a edition key. to get the edition key I used the workKey from the books results to fetch a array of entries that contain many editions in different languages and publish dates. 
2. I selected a edition that was in English and the earliest edition. The API does not provide a original edition.
3. Once I selected the earliest edition I used the edition key to fetch the editions info that contained number of pages, date published etc. And displayed the data.
*/

/*----------------------------------------------Get Book Of The Day----------------------------------------------*/
export async function getBookOfTheDay() {
  try {
    const res = await fetch(`${API_URL}/trending/daily.json`);

    if (!res.ok) {
      throw new Error('Failed to fetch book of the day');
    }

    const data = await res.json();
    return data.works[0];
  } catch (error) {
    console.error(error);
  }
}

/*------------------------------------Get Selected Genre-----------------------------------------------------------*/
export async function getGenreBooks(genre) {
  try {
    const res = await fetch(`${API_URL}/subjects/${genre}.json?limit=20`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ${genre} books`);
    }

    const data = await res.json();
    return data.works;
  } catch (error) {
    console.error(error);
  }
}
