// // src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import SearchByCoverPage from './pages/SearchByCoverPage';
import SearchByContentPage from './pages/SearchByContentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/search/cover" element={<SearchByCoverPage />} />
        <Route path="/search/content" element={<SearchByContentPage />} />
      </Routes>
    </Router>
  );
}

export default App;