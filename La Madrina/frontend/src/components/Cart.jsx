import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import Checkout from './Checkout';

const Cart = ({ showAsPage = false, onProceedToCheckout }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useCart();

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      setShowCheckout(true);
    }
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeFromCart(id);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // If showing as a page component
  if (showAsPage) {
    return (
      <div className="w-100">
        {showCheckout ? (
          <Checkout onClose={handleBackToCart} />
        ) : (
          <div>
            {cartItems.length === 0 ? (
              <div className="text-center p-5">
                <div className="mb-3">
                  <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#E91E63' }}></i>
                </div>
                <h4 className="text-muted">Your cart is empty</h4>
                <p className="text-muted mb-4">Browse our menu and add some delicious items!</p>
                <button className="btn btn-primary">
                  Browse Menu
                </button>
              </div>
            ) : (
              <div>
                <div className="row g-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="col-12">
                      <div className="card border-0 shadow-sm">
                        <div className="row g-0">
                          <div className="col-md-3">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="img-fluid h-100 w-100"
                              style={{ 
                                objectFit: 'cover', 
                                borderRadius: '8px 0 0 8px',
                                minHeight: '120px'
                              }}
                            />
                          </div>
                          <div className="col-md-9">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h5 className="card-title mb-1">{item.name}</h5>
                                  <p className="text-muted mb-0 small">{item.category}</p>
                                </div>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                              
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </button>
                                  <span className="mx-3 fw-bold">{item.quantity}</span>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="text-end">
                                  <div className="fw-bold text-primary">
                                    {formatPrice(item.price * item.quantity)}
                                  </div>
                                  <small className="text-muted">
                                    {formatPrice(item.price)} each
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="card mt-4 border-0 bg-light">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Order Summary</h5>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={clearCart}
                      >
                        Clear Cart
                      </button>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Items ({getCartItemsCount()})</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Delivery Fee</span>
                      <span>$2.99</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax</span>
                      <span>{formatPrice(getCartTotal() * 0.08)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold h5">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatPrice(getCartTotal() + 2.99 + (getCartTotal() * 0.08))}
                      </span>
                    </div>
                    
                    <button
                      className="btn btn-primary btn-lg w-100 mt-3"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Regular cart sidebar
  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 1040 }}
        onClick={handleCloseCart}
      />

      {/* Cart Sidebar */}
      <div
        className="position-fixed top-0 end-0 bg-white shadow-lg d-flex flex-column"
        style={{
          width: showCheckout ? '600px' : '450px',
          maxHeight: '100vh',
          height: cartItems.length === 0 ? 'auto' : 'fit-content',
          minHeight: '300px',
          zIndex: 1050,
          transition: 'width 0.3s ease'
        }}
      >
        {/* Cart Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom flex-shrink-0" style={{ backgroundColor: '#F8BBD9' }}>
          <h5 className="mb-0" style={{ color: '#E91E63' }}>
            <i className="bi bi-cart-fill me-2"></i>
            {showCheckout ? 'Checkout' : `Cart (${getCartItemsCount()})`}
          </h5>
          <button
            className="btn btn-sm"
            onClick={handleCloseCart}
            style={{ color: '#E91E63' }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Cart Content */}
        <div 
          className="overflow-auto p-3" 
          style={{ 
            maxHeight: `calc(100vh - 200px)`,
            minHeight: '200px'
          }}
        >
          {showCheckout ? (
            <Checkout onClose={handleBackToCart} />
          ) : cartItems.length === 0 ? (
            <div className="text-center p-4">
              <div className="mb-3">
                <i className="bi bi-cart-x" style={{ fontSize: '3rem', color: '#E91E63' }}></i>
              </div>
              <h6 className="text-muted">Your cart is empty</h6>
              <p className="text-muted mb-0">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div key={item.id} className="card mb-3 border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                  <div className="row g-0">
                    <div className="col-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="img-fluid h-100 w-100"
                        style={{ 
                          objectFit: 'cover', 
                          borderRadius: '8px 0 0 8px',
                          maxHeight: '100px'
                        }}
                      />
                    </div>
                    <div className="col-8">
                      <div className="card-body p-2">
                        <h6 className="card-title mb-1" style={{ fontSize: '0.85rem', lineHeight: '1.2' }}>
                          {item.name}
                        </h6>
                        <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                          {item.category}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold" style={{ color: '#E91E63', fontSize: '0.85rem' }}>
                            {formatPrice(item.price)}
                          </span>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              style={{ 
                                padding: '2px 6px', 
                                fontSize: '0.7rem',
                                backgroundColor: '#F8BBD9',
                                borderColor: '#F8BBD9',
                                color: '#E91E63',
                                minWidth: '24px',
                                height: '24px'
                              }}
                            >
                              -
                            </button>
                            <span
                              className="mx-2 text-center"
                              style={{ 
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                minWidth: '20px'
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              style={{ 
                                padding: '2px 6px', 
                                fontSize: '0.7rem',
                                backgroundColor: '#F8BBD9',
                                borderColor: '#F8BBD9',
                                color: '#E91E63',
                                minWidth: '24px',
                                height: '24px'
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            Total: {formatPrice(item.price * item.quantity)}
                          </small>
                          <button
                            className="btn btn-sm p-0"
                            onClick={() => removeFromCart(item.id)}
                            style={{ color: '#dc3545', fontSize: '0.8rem' }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {!showCheckout && cartItems.length > 0 && (
          <div className="border-top p-3 flex-shrink-0" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold">Total:</span>
              <span className="fw-bold h5 mb-0" style={{ color: '#E91E63' }}>
                {formatPrice(getCartTotal())}
              </span>
            </div>
            <button
              className="btn w-100 mb-2"
              onClick={handleCheckout}
              style={{
                backgroundColor: '#E91E63',
                borderColor: '#E91E63',
                color: 'white',
                borderRadius: '8px'
              }}
            >
              Checkout ({getCartItemsCount()} items)
            </button>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm flex-grow-1"
                onClick={() => setIsCartOpen(false)}
                style={{
                  borderRadius: '6px',
                  fontSize: '0.8rem'
                }}
              >
                Continue Shopping
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={clearCart}
                style={{
                  borderRadius: '6px',
                  fontSize: '0.8rem'
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
