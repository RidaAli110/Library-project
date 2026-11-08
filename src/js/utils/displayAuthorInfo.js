import { fetchAuthor } from '../api/open-library.js';

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
    return fetchAuthor(author.author?.key ?? author.key);
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
