import { loadSavedBooks, saveBookToLocalStorage } from "../../utils/save-to-books.js";

/*-----------------------------------Event Listener For Save Button-----------------------------------*/
export function handleSavedBook(saveBtn, book) {
  saveBtn.addEventListener('click', () => {
    // When the save button is clicked save the book to local storage.
    saveBookToLocalStorage(book);
    // Update save button text every time it's clicked.
    updateSaveButtonText(saveBtn, book);
  });
}

/*--------------------------------------Update Save Button Text-------------------------------------- */
export function updateSaveButtonText(saveBtn, book) {
  // Get all the saved books
  const savedBooks = loadSavedBooks();

  // Check if the selected book is already in the saved books array. 
  const isBookAlreadySaved = savedBooks.some((savedBook) => {
    return savedBook.key === book.key;
  });

  // If true update button text.
  if (isBookAlreadySaved) {
    saveBtn.textContent = 'Remove Book';
  } else {
    saveBtn.textContent = 'Save Book';
  }
}