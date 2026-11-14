/*--------------------------Getting Saved Books From Local Storage--------------------------*/
export function loadSavedBooks() {
  const savedBooks = JSON.parse(localStorage.getItem('saved-books')) ?? [];
  return savedBooks;
}

/*--------------------------Saving a Book To Local Storage (Toggle)--------------------------*/
export function saveBookToLocalStorage(book) {
  const savedBooks = loadSavedBooks();

  const currentlySaved = savedBooks.some((savedBook) => {
    return savedBook.key === book.key;
  });

  let updatedBooksList;

  if (currentlySaved) {
    updatedBooksList = savedBooks.filter((savedBook) => {
      return savedBook.key !== book.key;
    });
  } else {
    savedBooks.push(book);
    updatedBooksList = savedBooks;
  }

  localStorage.setItem('saved-books', JSON.stringify(updatedBooksList));

  return updatedBooksList;
}

/*-------------------------------Remove Book from local storage-------------------------------*/
export function removeBookFromLocalStorage(removedBook) {
  const savedBooks = loadSavedBooks();

  const updatedSavedBooks = savedBooks.filter((book) => {
    return book.key !== removedBook.key;
  });

  localStorage.setItem('saved-books', JSON.stringify(updatedSavedBooks));
  return updatedSavedBooks;
}
