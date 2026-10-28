'use strict';
const URL = 'https://openlibrary.org';

export async function getTrendingBooks() {
  try {
    const res = await fetch(`${URL}/trending/weekly.json?limit=16`);

    if (!res.ok) {
      throw new Error('failed to fetch');
    }

    const data = await res.json();
    return data.works;
  } catch (error) {
    console.log(error);
  }
}

//Search for books
export async function searchBook(book, signal) {
  try {
    const res = await fetch(
      `${URL}/search.json?q=${encodeURIComponent(book)}&limit=5`,
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

export async function getBookDetails(key) {
  try {
    const res = await fetch(`${URL}${key}.json`);
    if (!res.ok) {
      throw new Error('Failed to fetch book details');
    }
    
    const bookDetails = await res.json();
    return bookDetails;
  } catch (error) {
    console.error(error);
  }
}
