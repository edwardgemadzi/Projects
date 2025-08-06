import React, { useState } from 'react';

const ProductSearch = ({ onSearch, onFilterChange, categories, currentFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (category) => {
    onFilterChange(category);
  };

  const handlePriceFilter = () => {
    onSearch(searchTerm, { priceRange, sortBy });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
    onFilterChange('all');
    onSearch('');
  };

  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      all: 'All Products',
      bread: 'Breads',
      cakes: 'Cakes',
      pastries: 'Pastries',
      cookies: 'Cookies',
      specialty: 'Specialty Items'
    };
    return categoryNames[category] || category;
  };

  return (
    <div className="product-search-container mb-4">
      <div className="card" style={{ borderColor: '#F8BBD9' }}>
        <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
          <h5 className="mb-0" style={{ color: '#E91E63' }}>
            <i className="bi bi-search me-2"></i>
            Search & Filter Products
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">Search Products</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Search by name, description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ borderColor: '#F8BBD9' }}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleSearchChange({ target: { value: '' } })}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Sort Options */}
            <div className="col-md-3">
              <label htmlFor="sort" className="form-label">Sort By</label>
              <select
                className="form-select"
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ borderColor: '#F8BBD9' }}
              >
                <option value="name">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="col-md-3">
              <label className="form-label">Price Range</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  style={{ borderColor: '#F8BBD9' }}
                />
                <span className="input-group-text">to</span>
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  style={{ borderColor: '#F8BBD9' }}
                />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="row mt-3">
            <div className="col-12">
              <label className="form-label">Categories</label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`btn ${currentFilter === category ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleFilterChange(category)}
                    style={{
                      backgroundColor: currentFilter === category ? '#E91E63' : 'transparent',
                      borderColor: '#E91E63',
                      color: currentFilter === category ? 'white' : '#E91E63'
                    }}
                  >
                    {getCategoryDisplayName(category)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row mt-3">
            <div className="col-12">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handlePriceFilter}
                  style={{
                    backgroundColor: '#E91E63',
                    borderColor: '#E91E63'
                  }}
                >
                  <i className="bi bi-funnel me-2"></i>
                  Apply Filters
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
