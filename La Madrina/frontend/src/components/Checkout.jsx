import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const cart = cartItems; // For compatibility with existing code
  const total = getCartTotal(); // Get total from context function
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    email: '',
    phone: '',
    specialInstructions: ''
  });

  // Auto-fill form when user is logged in
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        customerName: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);
  const [orderStatus, setOrderStatus] = useState('form'); // 'form', 'processing', 'success', 'error'
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!customerInfo.customerName.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!customerInfo.email.trim() || !/\S+@\S+\.\S+/.test(customerInfo.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!customerInfo.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (cart.length === 0) {
      setError('Your cart is empty');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setOrderStatus('processing');

    try {
      const orderPayload = {
        ...customerInfo,
        items: cart.map(item => ({
          productId: item.id, // Changed from item._id to item.id
          quantity: item.quantity,
          name: item.name,
          price: item.price
        })),
        total: total
      };

      const response = await ordersAPI.create(orderPayload);
      
      if (response.data.success) {
        setOrderData(response.data.data);
        setOrderStatus('success');
        clearCart();
      } else {
        throw new Error(response.data.message || 'Order submission failed');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to submit order. Please try again.');
      setOrderStatus('error');
    }
  };

  const formatPrice = (price) => {
    return `$${typeof price === 'number' ? price.toFixed(2) : '0.00'}`;
  };

  if (orderStatus === 'success') {
    return (
      <div className="checkout-container">
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body text-center p-5">
                  <div className="success-icon mb-4">
                    <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h2 className="text-success mb-3">Order Placed Successfully!</h2>
                  <p className="lead mb-4">Thank you for your order, {orderData?.customerName}!</p>
                  
                  <div className="order-details bg-light p-4 rounded mb-4">
                    <h5 className="mb-3">Order Details</h5>
                    <div className="row">
                      <div className="col-sm-6 text-start">
                        <strong>Order ID:</strong>
                      </div>
                      <div className="col-sm-6 text-start">
                        {orderData?._id}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 text-start">
                        <strong>Total:</strong>
                      </div>
                      <div className="col-sm-6 text-start">
                        {formatPrice(orderData?.total)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6 text-start">
                        <strong>Status:</strong>
                      </div>
                      <div className="col-sm-6 text-start">
                        <span className="badge bg-warning">{orderData?.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="contact-info alert alert-info">
                    <h6><i className="fas fa-info-circle me-2"></i>Next Steps</h6>
                    <p className="mb-2">
                      <strong>📧 Email:</strong> You'll receive a confirmation email shortly at {orderData?.email}
                    </p>
                    <p className="mb-2">
                      <strong>📱 Phone:</strong> We may call you at {orderData?.phone} if we have any questions
                    </p>
                    <p className="mb-0">
                      <strong>🕐 Pickup:</strong> Your order will be ready for pickup within 2-3 hours during business hours
                    </p>
                  </div>

                  <div className="action-buttons">
                    <a 
                      href={`/track?id=${orderData?._id}`} 
                      className="btn btn-primary me-3"
                    >
                      <i className="fas fa-search me-2"></i>Track Your Order
                    </a>
                    <a href="/menu" className="btn btn-outline-primary">
                      <i className="fas fa-plus me-2"></i>Order More Items
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">
                  <i className="fas fa-user me-2"></i>Customer Information
                </h4>
              </div>
              <div className="card-body">
                {user && (
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    We've pre-filled your information from your account. You can edit any field if needed.
                  </div>
                )}
                
                {error && (
                  <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="customerName" className="form-label">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="customerName"
                        name="customerName"
                        value={customerInfo.customerName}
                        onChange={handleInputChange}
                        required
                        disabled={orderStatus === 'processing'}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                        disabled={orderStatus === 'processing'}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      disabled={orderStatus === 'processing'}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="specialInstructions" className="form-label">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      className="form-control"
                      id="specialInstructions"
                      name="specialInstructions"
                      rows="3"
                      value={customerInfo.specialInstructions}
                      onChange={handleInputChange}
                      disabled={orderStatus === 'processing'}
                      placeholder="Any special requests or dietary restrictions..."
                    ></textarea>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={orderStatus === 'processing' || cart.length === 0}
                    >
                      {orderStatus === 'processing' ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check me-2"></i>
                          Place Order ({formatPrice(total)})
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-shopping-cart me-2"></i>Order Summary
                </h5>
              </div>
              <div className="card-body">
                {cart.length === 0 ? (
                  <p className="text-muted mb-0">Your cart is empty</p>
                ) : (
                  <>
                    {cart.map((item, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>
                        <span className="fw-bold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <h5 className="mb-0">Total:</h5>
                      <h5 className="mb-0 text-primary">{formatPrice(total)}</h5>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="alert alert-info mt-3">
              <h6 className="alert-heading">
                <i className="fas fa-info-circle me-2"></i>Important Information
              </h6>
              <ul className="mb-0 small">
                <li>Orders are for pickup only</li>
                <li>Payment will be collected at pickup</li>
                <li>Please allow 2-3 hours for order preparation</li>
                <li>We'll contact you if any items are unavailable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
