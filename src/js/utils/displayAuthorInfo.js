import { fetchAuthor } from '../api/open-library.js';

/*------------------------------Store Author names in cache------------------------------*/
// Create map() to store author names that have already been fetched into a cache
const authorCache = new Map();

async function getCachedAuthor(authorKey) {
  if (authorCache.has(authorKey)) {
    return authorCache.get(authorKey);
  } else {
    const author = await fetchAuthor(authorKey);

    if (author === undefined) {
      return;
    }

    // Store the fetch response into the cache. 'authorKey' is the Id and 'author' is the value
    authorCache.set(authorKey, author);

    return author;
  }
}

/*------------------------------Fetch and display authors------------------------------*/
export default async function fetchAndDisplayAuthors(
  authorId,
  authorTextVariable,
) {
  const names = [];

  if (authorId == null || authorId.length < 1) {
    authorTextVariable.textContent = 'Author information unavailable';
    return;
  }

  // Create a promises array to fetch all the authors together
  const authorNameFetchRequests = authorId.map((author) => {
    return getCachedAuthor(author.author?.key ?? author.key);
  });
  const authorsNamesArray = await Promise.all(authorNameFetchRequests);

  // Loop through the authorNamesArray and push each name to names array
  for (const authorNames of authorsNamesArray) {
    // If a name is missing skip to the next
    if (!authorNames?.name) {
      continue;
    }
    names.push(authorNames.name);
  }

  authorTextVariable.textContent =
    names.join(' - ') || 'Author information unavailable';
}
