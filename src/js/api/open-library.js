'use strict';
import { getPublishYear, formatPublishDate } from '../utils/date-utils.js';

const API_URL = 'https://openlibrary.org';

/*------------------------------------Get Trending Books-----------------------------------*/
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

/*-------------------------------------Search for books-------------------------------------*/
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

/*-----------------------------------Fetch Author details-----------------------------------*/
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

/*-------------------------------------Get Book Details-------------------------------------*/
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

/*---------------------------------Book Edition Information---------------------------------*/
export async function displayBookEditionInfo(
  key,
  pages,
  publishDate,
  publisher,
) {
  // Get the array of entries containing editions and their keys
  const editionKey = await fetchEditionKey(key);

  if (!editionKey) {
    return;
  }

  // Filter the entries to return the ones that are in english
  const englishEdition = editionKey.filter((edition) => {
    return edition.languages?.some(
      (language) => language.key === '/languages/eng',
    );
  });

  if (englishEdition.length === 0) {
    return;
  }

  // returns an array containing the earliest editions
  englishEdition.sort((a, b) => {
    return getPublishYear(a.publish_date) - getPublishYear(b.publish_date);
  });

  const earliestEdition = englishEdition[0];

  // Fetch's the edition details using the earliest editions key.
  const editionDetails = await fetchEditionDetails(earliestEdition.key);
  
  // Display the information returned
  pages.textContent = editionDetails.number_of_pages || 'Not available';
  publishDate.textContent = formatPublishDate(editionDetails.publish_date);
  publisher.textContent =
    editionDetails.publishers?.join(' - ') || 'Not available';
}

/*-------------------------Fetch edition key using the book workKey-------------------------*/
export async function fetchEditionKey(workKey) {
  try {
    const res = await fetch(
      `${API_URL}${workKey}/editions.json?limit=200&offset=0`,
    );

    if (!res.ok) {
      throw new Error('Failed to fetch');
    }

    const data = await res.json();
    return data.entries;
  } catch (error) {
    console.error(error);
  }
}

/*------------------------Fetch edition details using the edition key------------------------*/
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

/*
 * Logic behind fetching a book's edition information:
 *
 * 1. To get a books edition info a edition key is needed which can be fetched by using a books workKey.
 *    The API will return an array of entries containing many editions in different languages and publish dates.
 *
 * 2. Filter the editions to find those published in English, then select
 *    the earliest one. The API does not identify which edition is the original.
 *
 * 3. Use the selected edition's key to fetch its full details, including
 *    the number of pages and publication date.
 *
 * 4. Display the retrieved edition information on the book details page.
 */

/*------------------------------------Get Book Of The Day------------------------------------*/
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

/*-------------------------------------Get Selected Genre-------------------------------------*/
export async function getGenreBooks(genre) {
  try {
    const res = await fetch(`${API_URL}/subjects/${genre}.json?limit=30`);

    if (!res.ok) {
      throw new Error(`Failed to fetch ${genre} books`);
    }

    const data = await res.json();
    return data.works;
  } catch (error) {
    console.error(error);
  }
}
