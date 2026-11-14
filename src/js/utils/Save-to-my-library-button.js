import { loadSavedBooks, saveBookToLocalStorage } from "./save-to-books.js";

/*------------------------------Event Listener For Save Button------------------------------*/
export function handleSavedBook(saveBtn, book, msg) {
  saveBtn.addEventListener('click', () => {
    saveBookToLocalStorage(book);
    updateSaveButtonText(saveBtn, book, msg);
  });
}

/*---------------------------------Update Save Button Text----------------------------------*/
export function updateSaveButtonText(saveBtn, book, msg) {
  const savedBooks = loadSavedBooks();

  const isBookAlreadySaved = savedBooks.some((savedBook) => {
    return savedBook.key === book.key;
  });

  if (isBookAlreadySaved) {
    saveBtn.textContent = msg;
  } else {
    saveBtn.textContent = 'Save to Library';
  }
}