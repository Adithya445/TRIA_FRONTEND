import React from 'react';
import './SearchBox.css';

function SearchBox({ searchTerm, onSearchChange }) {
  return (
    <div className="search-box-container">
      <input
        type="text"
        placeholder="Search contacts by name..."
        value={searchTerm}
        onChange={onSearchChange}
        className="search-input"
      />
    </div>
  );
}

export default SearchBox;