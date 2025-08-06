import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { name, description, price, image, category, inStock } = product;
  const { addToCart, updateQuantity, cartItems } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Check if item is already in cart
  const cartItem = cartItems.find(item => item.id === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      bread: '🍞',
      cakes: '🎂',
      pastries: '🥐',
      cookies: '🍪',
      specialty: '⭐'
    };
    return icons[category] || '🧁';
  };

  const handleAddToCart = async () => {
    if (!inStock) return;
    
    setIsAdding(true);
    try {
      addToCart(product, 1);
      setTimeout(() => setIsAdding(false), 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      updateQuantity(product._id, 0);
    } else {
      updateQuantity(product._id, newQuantity);
    }
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm" style={{ borderColor: '#F8BBD9' }}>
        <img
          src={image || '/images/placeholder.jpg'}
          className="card-img-top"
          alt={name}
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRkNFNEVDIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNFOTFFNjMiPkxhIE1hZHJpbmE8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNFOTFFNjMiPkJha2VyeSDwn5KXPC90ZXh0Pgo8L3N2Zz4=';
          }}
        />
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0" style={{ color: '#E91E63' }}>{name}</h5>
            <span className="badge" style={{ backgroundColor: '#F8BBD9', color: '#E91E63' }}>
              {getCategoryIcon(category)} {category}
            </span>
          </div>
          
          {description && (
            <p className="card-text text-muted">{description}</p>
          )}
          
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold" style={{ color: '#E91E63', fontSize: '1.2rem' }}>
                {formatPrice(price)}
              </span>
              <div className="d-flex align-items-center">
                {inStock ? (
                  <span className="badge bg-success">In Stock</span>
                ) : (
                  <span className="badge bg-danger">Out of Stock</span>
                )}
              </div>
            </div>
            
            {/* Conditional Rendering: Add to Cart vs Quantity Controls */}
            {quantityInCart === 0 ? (
              <button 
                className="btn w-100"
                style={{
                  backgroundColor: inStock ? '#E91E63' : '#6c757d',
                  borderColor: inStock ? '#E91E63' : '#6c757d',
                  color: 'white'
                }}
                disabled={!inStock || isAdding}
                onClick={handleAddToCart}
              >
                {isAdding ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Adding...
                  </>
                ) : inStock ? (
                  <>
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </>
                ) : (
                  'Out of Stock'
                )}
              </button>
            ) : (
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small">In Cart:</span>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm"
                    onClick={() => handleQuantityChange(quantityInCart - 1)}
                    style={{
                      backgroundColor: '#F8BBD9',
                      borderColor: '#F8BBD9',
                      color: '#E91E63',
                      width: '32px',
                      height: '32px',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    -
                  </button>
                  <span 
                    className="mx-3 fw-bold"
                    style={{ 
                      color: '#E91E63',
                      fontSize: '1.1rem',
                      minWidth: '20px',
                      textAlign: 'center'
                    }}
                  >
                    {quantityInCart}
                  </span>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleQuantityChange(quantityInCart + 1)}
                    style={{
                      backgroundColor: '#E91E63',
                      borderColor: '#E91E63',
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
