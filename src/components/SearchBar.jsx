import React from "react";

export default function SearchBar({ value, onChange, placeholder = "Search products..." }) {
  return (
    <div className="search-bar">
      <label htmlFor="site-search" className="visually-hidden">Search products</label>
      <input
        id="site-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
      />
      <button type="button" className="search-button" aria-label="Search">
        Search
      </button>
    </div>
  );
}
