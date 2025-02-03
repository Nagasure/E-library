import React, { useState, useCallback } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import debounce from 'lodash/debounce';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearch = useCallback(
        debounce((term) => {
            onSearch(term.trim());
        }, 300),
        [onSearch]
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm.trim());
    };

    return (
        <Form onSubmit={handleSubmit}>
            <InputGroup>
                <Form.Control
                    type="search"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={handleChange}
                    aria-label="Search books by title"
                    maxLength={100}
                />
                <Button 
                    variant="outline-secondary" 
                    type="submit"
                    disabled={!searchTerm.trim()}
                >
                    Search
                </Button>
            </InputGroup>
        </Form>
    );
}

export default SearchBar;
