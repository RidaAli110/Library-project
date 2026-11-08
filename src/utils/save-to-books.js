/*----------------------------------Getting Saved Books From Local Storage----------------------------------*/
export function loadSavedBooks() {
  // When the page loads or refreshes retrieve the saved books, or an empty array
  const savedBooks = JSON.parse(localStorage.getItem('saved-books')) ?? [];
  return savedBooks;
}

/*----------------------------------Saving a Book To Local Storage (Toggle)----------------------------------*/
export function saveBookToLocalStorage(book) {
  // Retrieve the previous saved Books
  const savedBooks = loadSavedBooks();

  // This checks if the book has already been saved.
  const currentlySaved = savedBooks.some((savedBook) => {
    return savedBook.key === book.key;
  });

  // Declare variable here so it can be accesses outside if/else
  let updatedBooksList;

  if (currentlySaved /* returns true */) {
    // Remove the book if it's already saved
    updatedBooksList = savedBooks.filter((savedBook) => {
      return savedBook.key !== book.key;
    });
  } else {
    // If it isn't saved add it to the savedBooks array
    savedBooks.push(book);

    // Assign the updated list to the savedBooks array which contains the new book
    updatedBooksList = savedBooks;
  }

  // Update localStorage with the updated list
  localStorage.setItem('saved-books', JSON.stringify(updatedBooksList));

  return updatedBooksList;
}

/*----------------------------------Remove Book from local storage----------------------------------*/
export function removeBookFromLocalStorage(removedBook) {
  const savedBooks = loadSavedBooks();

  const updatedSavedBooks = savedBooks.filter((book) => {
    return book.key !== removedBook.key;
  });

  localStorage.setItem('saved-books', JSON.stringify(updatedSavedBooks));
  return updatedSavedBooks;
}
