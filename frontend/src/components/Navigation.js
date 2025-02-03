import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

function Navigation() {
  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    navigate(`/books?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">E-Library</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/books">Books</Nav.Link>
            <Nav.Link as={Link} to="/add-book">Add Book</Nav.Link>
          </Nav>
          <div className="ms-auto" style={{ inline: '300px' }}>
            <SearchBar onSearch={handleSearch} />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
