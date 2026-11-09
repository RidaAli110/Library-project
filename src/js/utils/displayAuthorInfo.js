import { fetchAuthor } from '../api/open-library.js';

/*---------------------------------------Store Author names in cache---------------------------------------*/
// Create map() to store author names that have already been fetched into a cache
const authorCache = new Map();

async function getCachedAuthor(authorKey){
  // Check if the author names are already stored in the cache from previous fetch
if (authorCache.has(authorKey)){
  // If we have it then return the data from the cache
  return authorCache.get(authorKey);
} else {
  // If its not stored in the cache then fetch from the API
  const author = await fetchAuthor(authorKey);

  // If API request doesn't work stop the function and try again. 
  if(author === undefined) {
    return;
  }

  // Store the fetch response into the cache. 'authorKey' is the Id and 'author' is the value
  authorCache.set(authorKey, author );

  // return author information
  return author;
}
}

/*---------------------------------------Fetch and display authors---------------------------------------*/
export default async function fetchAndDisplayAuthors(
  authorId,
  authorTextVariable,
) {
  // Array that holds the authors names
  const names = [];

  // (authorId == null) checks for both null and undefined
  if (authorId == null || authorId.length < 1) {
    authorTextVariable.textContent = 'Author information unavailable';
    return;
  }

  // Create a promises array to fetch all the authors together
  const authorNameFetchRequests = authorId.map((author) => {
    return getCachedAuthor(author.author?.key ?? author.key);
  });

  // await for the requests to be finished and store the names in a variable
  const authorsNamesArray = await Promise.all(authorNameFetchRequests);

  // Loop through the authorNamesArray and push each name to names array
  for (const authorNames of authorsNamesArray) {
    // If a name is missing skip to the next
    if (!authorNames?.name) {
      continue;
    }
    names.push(authorNames.name);
  }
  // Display the authors names from the names array
  authorTextVariable.textContent =
    names.join(' - ') || 'Author information unavailable';
}
