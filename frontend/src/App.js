import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Books from './pages/Books';
import AddBook from './pages/AddBook';
import Navigation from './components/Navigation';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<AddBook />} />
      </Routes>
    </>
  );
}

export default App;
