import { loadSavedBooks, saveBookToLocalStorage } from "./save-to-books.js";

/*-----------------------------------Event Listener For Save Button-----------------------------------*/
export function handleSavedBook(saveBtn, book, msg) {
  saveBtn.addEventListener('click', () => {
    // When the save button is clicked save the book to local storage.
    saveBookToLocalStorage(book);
    // Update save button text every time it's clicked.
    updateSaveButtonText(saveBtn, book, msg);
  });
}

/*--------------------------------------Update Save Button Text-------------------------------------- */
export function updateSaveButtonText(saveBtn, book, msg) {
// 'msg' is the custom text i want for the remove buttons for book details page and genre results page

  // Get all the saved books
  const savedBooks = loadSavedBooks();

  // Check if the selected book is already in the saved books array. 
  const isBookAlreadySaved = savedBooks.some((savedBook) => {
    return savedBook.key === book.key;
  });

  // If true update button text.
  if (isBookAlreadySaved) {
    saveBtn.textContent = msg;
  } else {
    saveBtn.textContent = 'Save to Library';
  }
}