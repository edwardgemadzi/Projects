import React, { useState } from 'react';
import OrderTracking from '../components/OrderTracking';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [showTracking, setShowTracking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      setShowTracking(true);
    }
  };

  const handleNewSearch = () => {
    setOrderId('');
    setShowTracking(false);
  };

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {!showTracking ? (
            <div>
              {/* Header */}
              <div className="text-center mb-5">
                <h1 className="section-title">Track Your Order</h1>
                <p className="lead">
                  Enter your order ID to see the current status and estimated completion time.
                </p>
              </div>

              {/* Order ID Form */}
              <div className="card shadow-sm" style={{ borderColor: '#F8BBD9' }}>
                <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                  <h5 className="mb-0" style={{ color: '#E91E63' }}>
                    <i className="bi bi-search me-2"></i>
                    Enter Order Information
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="orderId" className="form-label">
                        Order ID
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="orderId"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter your order ID (e.g., abc123de)"
                        style={{ borderColor: '#F8BBD9' }}
                        required
                      />
                      <div className="form-text">
                        You can find your order ID in the confirmation email or receipt.
                      </div>
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-lg"
                        style={{
                          backgroundColor: '#E91E63',
                          borderColor: '#E91E63',
                          color: 'white'
                        }}
                      >
                        <i className="bi bi-search me-2"></i>
                        Track Order
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Help Section */}
              <div className="row mt-5">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <i className="bi bi-question-circle" style={{ fontSize: '2rem', color: '#E91E63' }}></i>
                      <h5 className="mt-3">Need Help?</h5>
                      <p className="text-muted">
                        Can't find your order ID or having trouble tracking your order?
                      </p>
                      <a href="/contact" className="btn btn-outline-primary">
                        Contact Us
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <i className="bi bi-clock-history" style={{ fontSize: '2rem', color: '#E91E63' }}></i>
                      <h5 className="mt-3">Order History</h5>
                      <p className="text-muted">
                        Logged in customers can view all their past orders.
                      </p>
                      <a href="/profile" className="btn btn-outline-primary">
                        View History
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Back Button */}
              <div className="mb-4">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleNewSearch}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Track Another Order
                </button>
              </div>

              {/* Order Tracking Component */}
              <OrderTracking orderId={orderId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
