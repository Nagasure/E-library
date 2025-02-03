import axios from 'axios';

const API_BASE_URL = 'http://localhost/e-library-web-app/backend/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const bookService = {
  getAllBooks: () => api.get('/books.php'),
  getBook: (id) => api.get(`/books.php?id=${id}`),
  addBook: (data) => api.post('/addBook.php', data),
  updateBook: (id, data) => api.post('/updateBook.php', { ...data, id }),
  deleteBook: (id) => api.post('/deleteBook.php', { id }),
};

export const authService = {
  login: (credentials) => api.post('/login.php', credentials),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

export default api;
