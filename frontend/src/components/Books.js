import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const fetchBooks = useCallback(async (search, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const controller = new AbortController();
      const signal = controller.signal;
      
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost/e-library-web-app/backend/api';
      let url = `${baseUrl}/books.php?page=${page}&limit=${pagination.limit}`;
      
      if (search) {
        url += `&title=${encodeURIComponent(search.trim())}`;
      }

      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      if (data.status === 'error') throw new Error(data.message);
      
      setBooks(data.books || []);
      setPagination(prev => ({
        ...prev,
        page: data.page || 1,
        totalPages: data.total_pages || 1,
        total: data.total || 0
      }));

      return () => controller.abort();
    } catch (error) {
      if (error.name === 'AbortError') return;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    setSearchTerm(search || '');
    fetchBooks(search, pagination.page);
  }, [location.search, pagination.page, fetchBooks]);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === pagination.page}
          onClick={() => fetchBooks(searchTerm, i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pages;
  };

  const paginationItems = useMemo(() => renderPagination(), [
    pagination.page,
    pagination.totalPages,
    searchTerm
  ]);

  return (
    <Container className="mt-4">
      {loading ? (
        <Container className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      ) : error ? (
        <Alert variant="danger">
          Error: {error}
        </Alert>
      ) : books.length === 0 ? (
        <Alert variant="info">No books found</Alert>
      ) : (
        <>
          <Row>
            {books.map((book) => (
              <Col key={book.id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text>
                      <strong>Author:</strong> {book.author}<br />
                      <strong>ISBN:</strong> {book.isbn}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          <Pagination className="mt-3 justify-content-center">
            <Pagination.First 
              onClick={() => fetchBooks(searchTerm, 1)}
              disabled={pagination.page === 1}
            />
            <Pagination.Prev 
              onClick={() => fetchBooks(searchTerm, pagination.page - 1)}
              disabled={pagination.page === 1}
            />
            {paginationItems}
            <Pagination.Next 
              onClick={() => fetchBooks(searchTerm, pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            />
            <Pagination.Last 
              onClick={() => fetchBooks(searchTerm, pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
            />
          </Pagination>
        </>
      )}
    </Container>
  );
}

export default Books;
