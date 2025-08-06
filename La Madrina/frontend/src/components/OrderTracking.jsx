import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const OrderTracking = ({ orderId, isAdmin = false }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      setLoading(false);
      setError('');
    };
  }, [orderId]); // Only depend on orderId

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      if (isAdmin) {
        // Admin access - full order details
        try {
          response = await ordersAPI.getById(orderId);
        } catch (adminError) {
          // Fallback to public tracking if admin access fails
          console.warn('Admin access failed, falling back to public tracking:', adminError);
          response = await ordersAPI.trackOrder(orderId);
        }
      } else {
        // Public tracking - limited details
        response = await ordersAPI.trackOrder(orderId);
      }
      
      setOrder(response.data.data);
    } catch (err) {
      // Enhanced error handling for different types of failures
      if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        setError('Network connection failed. Please check your internet connection and try again.');
      } else if (err.response?.status === 404) {
        setError('Order not found. Please check your order ID and try again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view this order.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Unable to load order information. Please try again later.');
      }
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    if (!isAdmin) {
      setError('You do not have permission to update order status.');
      return;
    }

    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You do not have permission to update this order.');
      } else if (err.response?.status === 404) {
        setError('Order not found.');
      } else {
        setError('Failed to update order status. Please try again.');
      }
      console.error('Error updating order status:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Confirmed': 'info',
      'In Progress': 'primary',
      'Ready': 'success',
      'Completed': 'success',
      'Cancelled': 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'clock',
      'Confirmed': 'check-circle',
      'In Progress': 'gear',
      'Ready': 'check2-all',
      'Completed': 'check-circle-fill',
      'Cancelled': 'x-circle'
    };
    return icons[status] || 'circle';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getEstimatedTime = (status) => {
    const estimates = {
      'Pending': 'Processing your order...',
      'Confirmed': '30-45 minutes',
      'In Progress': '15-30 minutes',
      'Ready': 'Ready for pickup!',
      'Completed': 'Order completed',
      'Cancelled': 'Order cancelled'
    };
    return estimates[status] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" style={{ color: '#E91E63' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        No order found.
      </div>
    );
  }

  const statusSteps = ['Pending', 'Confirmed', 'In Progress', 'Ready', 'Completed'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="order-tracking">
      {/* Order Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card" style={{ borderColor: '#F8BBD9' }}>
            <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0" style={{ color: '#E91E63' }}>
                  <i className="bi bi-receipt me-2"></i>
                  Order #{order._id.slice(-8)}
                </h5>
                <span className={`badge bg-${getStatusColor(order.status)}`}>
                  <i className={`bi bi-${getStatusIcon(order.status)} me-1`}></i>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <strong>Customer:</strong> {order.customerName}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {order.email}
                  </div>
                  <div className="mb-3">
                    <strong>Phone:</strong> {order.phone || 'Not provided'}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <strong>Order Date:</strong> {formatDate(order.createdAt)}
                  </div>
                  <div className="mb-3">
                    <strong>Total:</strong> <span className="fw-bold">${order.total?.toFixed(2)}</span>
                  </div>
                  <div className="mb-3">
                    <strong>Estimated Time:</strong> {getEstimatedTime(order.status)}
                  </div>
                </div>
              </div>
              
              {order.specialInstructions && (
                <div className="mt-3">
                  <strong>Special Instructions:</strong>
                  <div className="bg-light p-2 rounded mt-1">
                    {order.specialInstructions}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Progress */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Order Progress</h6>
            </div>
            <div className="card-body">
              <div className="progress-container">
                <div className="d-flex justify-content-between mb-3">
                  {statusSteps.map((step, index) => (
                    <div key={step} className="text-center flex-fill">
                      <div 
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${
                          index <= currentStepIndex ? 'bg-success text-white' : 'bg-light text-muted'
                        }`}
                        style={{ width: '40px', height: '40px' }}
                      >
                        {index <= currentStepIndex ? (
                          <i className="bi bi-check"></i>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className={`small ${index <= currentStepIndex ? 'text-success fw-bold' : 'text-muted'}`}>
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Order Items</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name || item.productId}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price?.toFixed(2)}</td>
                        <td>${(item.quantity * (item.price || 0)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-active">
                      <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                      <td><strong>${order.total?.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="row">
          <div className="col-12">
            <div className="card border-warning">
              <div className="card-header bg-warning">
                <h6 className="mb-0">Admin Controls</h6>
              </div>
              <div className="card-body">
                <div className="d-flex gap-2 flex-wrap">
                  {statusSteps.map(status => (
                    <button
                      key={status}
                      className={`btn ${order.status === status ? 'btn-success' : 'btn-outline-primary'}`}
                      onClick={() => updateOrderStatus(status)}
                      disabled={order.status === status}
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => updateOrderStatus('Cancelled')}
                    disabled={order.status === 'Cancelled' || order.status === 'Completed'}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
