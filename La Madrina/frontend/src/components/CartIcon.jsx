import React from 'react';
import { useCart } from '../contexts/CartContext';

const CartIcon = () => {
  const { getCartItemsCount, toggleCart } = useCart();
  const itemCount = getCartItemsCount();

  return (
    <button 
      className="btn position-relative me-3"
      onClick={toggleCart}
      style={{ 
        color: '#E91E63',
        border: '1px solid #E91E63',
        background: 'transparent',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      aria-label="Shopping Cart"
    >
      <i className="bi bi-cart3" style={{ fontSize: '1.1rem' }}></i>
      {itemCount > 0 && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
          style={{ 
            backgroundColor: '#E91E63',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 'bold'
          }}
        >
          {itemCount > 99 ? '99+' : itemCount}
          <span className="visually-hidden">items in cart</span>
        </span>
      )}
    </button>
  );
};

export default CartIcon;
