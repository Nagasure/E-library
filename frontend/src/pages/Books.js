import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Spinner } from 'react-bootstrap';
import { bookService } from '../services/bookService';
import { toast } from 'react-toastify';

function Books() {
    const [books, setBooks] = useState([]);
    const [showPdf, setShowPdf] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const data = await bookService.getBooks();
            setBooks(data);
        } catch (error) {
            toast.error('Error fetching books: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this book?')) {
            try {
                await bookService.deleteBook(id);
                setBooks(books.filter(book => book.id !== id));
                toast.success('Book deleted');
            } catch (error) {
                toast.error('Failed to delete book');
            }
        }
    };

    const handlePdfView = (url) => {
        // Sanitize URL before displaying
        if (url && url.startsWith('http')) {
            setSelectedPdf(url);
            setShowPdf(true);
        } else {
            toast.error('Invalid PDF URL');
        }
    };

    return (
        <Container className="mt-4">
            <h2>Books List</h2>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>
                                    <Button 
                                        variant="primary" 
                                        className="me-2"
                                        onClick={() => handlePdfView(book.pdf_url)}
                                    >
                                        View PDF
                                    </Button>
                                    <Button 
                                        variant="danger"
                                        onClick={() => handleDelete(book.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showPdf} onHide={() => setShowPdf(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>PDF Viewer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe 
                        src={selectedPdf}
                        width="100%" 
                        height="600px" 
                        title="PDF Viewer"
                        sandbox="allow-same-origin allow-scripts allow-popups"
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default Books;
