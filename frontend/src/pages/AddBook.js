import React, { useState } from 'react';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services/api';

function AddBook() {
    const [book, setBook] = useState({ title: '', author: '', description: '', pdf_url: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateBook = (bookData) => {
        if (!bookData.title.trim()) return 'Title is required';
        if (!bookData.author.trim()) return 'Author is required';
        if (bookData.title.length > 255) return 'Title is too long';
        if (bookData.author.length > 255) return 'Author name is too long';
        try {
            new URL(bookData.pdf_url);
        } catch {
            return 'Invalid PDF URL';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const validationError = validateBook(book);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const sanitizedBook = {
                ...book,
                title: book.title.trim(),
                author: book.author.trim(),
                description: book.description.trim()
            };

            const result = await bookService.addBook(sanitizedBook);

            if (result.success) {
                navigate('/books');
            } else {
                setError(result.message || 'Failed to add book.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Failed to add book. Please check all fields and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1); // This will go back to the previous page
    };

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <Button 
                        variant="secondary" 
                        onClick={handleGoBack}
                        className="mb-3"
                    >
                        ← Go Back
                    </Button>
                </Col>
            </Row>
            <h2>Add New Book</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={book.title}
                        onChange={(e) => setBook({...book, title: e.target.value})}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                        type="text"
                        value={book.author}
                        onChange={(e) => setBook({...book, author: e.target.value})}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={book.description}
                        onChange={(e) => setBook({...book, description: e.target.value})}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>PDF URL</Form.Label>
                    <Form.Control
                        type="url"
                        placeholder="https://example.com/book.pdf"
                        value={book.pdf_url}
                        onChange={(e) => {
                            setError('');
                            setBook({...book, pdf_url: e.target.value});
                        }}
                        required
                    />
                    <Form.Text className="text-muted">
                        Enter a valid PDF URL (must start with http:// or https://)
                    </Form.Text>
                </Form.Group>
                <Row className="mt-3">
                    <Col xs={12} sm={6} className="mb-2">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Adding...' : 'Add Book'}
                        </Button>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Button 
                            variant="secondary" 
                            onClick={handleGoBack}
                            className="w-100"
                        >
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default AddBook;
