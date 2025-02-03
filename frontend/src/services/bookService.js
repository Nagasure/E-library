import axios from 'axios';

const API_URL = 'http://localhost/e-library-web-app/backend/api';

export const bookService = {
    async getBooks(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.title) queryParams.append('title', params.title);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.category) queryParams.append('category', params.category);
        
        const response = await fetch(`${API_URL}/books.php?${queryParams}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    },
    
    async addBook(bookData) {
        try {
            console.log('Sending book data:', bookData); // Debug log
            const response = await axios.post(`${API_URL}/addBook.php`, bookData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Request error:', error.response?.data || error.message);
            throw error.response?.data || error;
        }
    },
    
    async deleteBook(bookId) {
        const response = await axios.delete(`${API_URL}/deleteBook.php`, {
            data: { id: bookId }
        });
        return response.data;
    }
};
