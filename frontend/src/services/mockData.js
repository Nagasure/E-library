const BOOKS_KEY = 'mock_books';

const initialBooks = [
  { id: 1, title: 'Sample Book 1', author: 'Author 1', isbn: '1234567890', quantity: 5 },
  { id: 2, title: 'Sample Book 2', author: 'Author 2', isbn: '0987654321', quantity: 3 }
];

export const mockDataService = {
  getBooks: () => {
    const books = localStorage.getItem(BOOKS_KEY);
    if (!books) {
      localStorage.setItem(BOOKS_KEY, JSON.stringify(initialBooks));
      return initialBooks;
    }
    return JSON.parse(books);
  },

  addBook: (book) => {
    const books = mockDataService.getBooks();
    const newBook = { ...book, id: Date.now() };
    books.push(newBook);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    return newBook;
  },

  deleteBook: (id) => {
    const books = mockDataService.getBooks();
    const filtered = books.filter(book => book.id !== id);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(filtered));
  },

  updateBook: (id, updatedBook) => {
    const books = mockDataService.getBooks();
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
      books[index] = { ...updatedBook, id };
      localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    }
  }
};
