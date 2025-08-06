import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import ProductSearch from '../components/ProductSearch';
import { productsAPI } from '../services/api';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'bread', 'cakes', 'pastries', 'cookies', 'specialty'];

  // Enhanced filtering and searching with useMemo for performance
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (filter !== 'all') {
      filtered = filtered.filter(product => product.category === filter);
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const price = product.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filter, searchTerm, sortBy, priceRange]);

  const handleSearch = (term, options = {}) => {
    setSearchTerm(term);
    if (options.sortBy) setSortBy(options.sortBy);
    if (options.priceRange) setPriceRange(options.priceRange);
  };

  const handleFilterChange = (category) => {
    setFilter(category);
  };

  const getCategoryDisplayName = (category) => {
    const names = {
      all: 'All Items',
      bread: 'Breads',
      cakes: 'Cakes',
      pastries: 'Pastries',
      cookies: 'Cookies',
      specialty: 'Specialty'
    };
    return names[category] || category;
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '100px' }}>
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      {/* Header */}
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="section-title">Our Menu</h1>
          <p className="lead">
            Discover our full range of artisan baked goods, made fresh daily with love and tradition.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="error-message">
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={fetchProducts}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Component */}
      <ProductSearch
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        categories={categories}
        currentFilter={filter}
      />

      {/* Category Filter Tabs (Legacy - can be removed if search component is preferred) */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                className={`btn ${filter === category ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter(category)}
                style={{
                  backgroundColor: filter === category ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: filter === category ? 'white' : '#E91E63'
                }}
              >
                {getCategoryDisplayName(category)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row">
        {filteredProducts.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="display-1 mb-3">🥐</div>
            <h3>No products found</h3>
            <p className="text-muted">
              {filter === 'all' 
                ? 'No products are currently available.' 
                : `No products in the ${getCategoryDisplayName(filter)} category.`
              }
            </p>
            {filter !== 'all' && (
              <button 
                className="btn"
                style={{
                  backgroundColor: '#E91E63',
                  borderColor: '#E91E63',
                  color: 'white'
                }}
                onClick={() => setFilter('all')}
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>

      {/* Bottom CTA */}
      {filteredProducts.length > 0 && (
        <div className="row mt-5 mb-4">
          <div className="col-12 text-center">
            <div className="bg-light p-4 rounded">
              <h4>Can't find what you're looking for?</h4>
              <p className="mb-3">
                We offer custom orders and special requests. Contact us to discuss your needs!
              </p>
              <a 
                href="/contact" 
                className="btn"
                style={{
                  backgroundColor: '#E91E63',
                  borderColor: '#E91E63',
                  color: 'white'
                }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
