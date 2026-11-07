import { fetchAuthor } from "../js/api/open-library.js";

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

  // Loop through the array of authorId's and use the author keys to fetch the authors names
  for (let author of authorId) {
    const authorNames = await fetchAuthor(author.author?.key);

    // Check if the names exist
    if (!authorNames.name) {
      // If author name is missing skip, and move on to next author;
      continue;
    }

    // Push the authors names to the names array
    names.push(authorNames.name);
  }

  // Display the authors names from the names array and if there is more than one name add '-' between.
  authorTextVariable.textContent =
    names.join(' - ') || 'Author information unavailable';

}
