import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { Navigate } from 'react-router-dom';

const CustomerProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    preferences: {
      newsletter: false,
      notifications: true,
      dietaryRestrictions: []
    }
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch user profile
      const profileResponse = await fetch('/api/auth/me', { headers });
      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        setProfileData({
          name: userData.data.name || '',
          email: userData.data.email || '',
          phone: userData.data.phone || '',
          address: userData.data.address || {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          preferences: userData.data.preferences || {
            newsletter: false,
            notifications: true,
            dietaryRestrictions: []
          }
        });
      }

      // Fetch user's order history
      try {
        const ordersResponse = await ordersAPI.getMyOrders();
        if (ordersResponse.data.success) {
          setOrders(ordersResponse.data.data || []);
        }
      } catch (orderError) {
        console.error('Error fetching orders:', orderError);
        // Don't fail the whole page if orders can't be loaded
        setOrders([]);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (name.includes('preferences.')) {
      const prefField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/updatedetails', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error updating profile: ' + data.message);
      }
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container py-5" style={{ marginTop: '80px' }}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#E91E63' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="section-title">My Account</h1>
          <p className="lead">Manage your profile and preferences</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills justify-content-center">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
                style={{ 
                  backgroundColor: activeTab === 'profile' ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: activeTab === 'profile' ? 'white' : '#E91E63'
                }}
              >
                <i className="bi bi-person me-2"></i>
                Profile
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
                style={{ 
                  backgroundColor: activeTab === 'orders' ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: activeTab === 'orders' ? 'white' : '#E91E63'
                }}
              >
                <i className="bi bi-bag me-2"></i>
                Order History
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
                style={{ 
                  backgroundColor: activeTab === 'preferences' ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: activeTab === 'preferences' ? 'white' : '#E91E63'
                }}
              >
                <i className="bi bi-gear me-2"></i>
                Preferences
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm" style={{ borderColor: '#F8BBD9' }}>
              <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>
                  <i className="bi bi-person-circle me-2"></i>
                  Personal Information
                </h5>
              </div>
              <div className="card-body">
                {message && (
                  <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} border-0 shadow-sm mb-4`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderColor: '#F8BBD9' }}
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        style={{ borderColor: '#F8BBD9' }}
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      style={{ borderColor: '#F8BBD9' }}
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <hr className="my-4" />

                  <h6 style={{ color: '#E91E63' }}>Address Information</h6>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="address.street" className="form-label">Street Address</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderColor: '#F8BBD9' }}
                        id="address.street"
                        name="address.street"
                        value={profileData.address.street}
                        onChange={handleInputChange}
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="address.city" className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderColor: '#F8BBD9' }}
                        id="address.city"
                        name="address.city"
                        value={profileData.address.city}
                        onChange={handleInputChange}
                        placeholder="Your City"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="address.state" className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderColor: '#F8BBD9' }}
                        id="address.state"
                        name="address.state"
                        value={profileData.address.state}
                        onChange={handleInputChange}
                        placeholder="CA"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="address.zipCode" className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderColor: '#F8BBD9' }}
                        id="address.zipCode"
                        name="address.zipCode"
                        value={profileData.address.zipCode}
                        onChange={handleInputChange}
                        placeholder="12345"
                      />
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
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order History Tab */}
      {activeTab === 'orders' && (
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-sm" style={{ borderColor: '#F8BBD9' }}>
              <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>
                  <i className="bi bi-clock-history me-2"></i>
                  Order History
                </h5>
              </div>
              <div className="card-body">
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-bag-x display-4 text-muted"></i>
                    <h5 className="mt-3 text-muted">No orders yet</h5>
                    <p className="text-muted mb-4">
                      You haven't placed any orders yet. When you do, they'll appear here.
                    </p>
                    <a href="/menu" className="btn" style={{
                      backgroundColor: '#E91E63',
                      borderColor: '#E91E63',
                      color: 'white'
                    }}>
                      <i className="bi bi-shop me-2"></i>
                      Browse Menu
                    </a>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead style={{ backgroundColor: '#F8BBD9' }}>
                        <tr>
                          <th style={{ color: '#E91E63' }}>Order ID</th>
                          <th style={{ color: '#E91E63' }}>Date</th>
                          <th style={{ color: '#E91E63' }}>Items</th>
                          <th style={{ color: '#E91E63' }}>Total</th>
                          <th style={{ color: '#E91E63' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td>
                              <small className="text-muted">#{order._id.slice(-8)}</small>
                            </td>
                            <td>
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td>
                              <div>
                                {order.items.slice(0, 2).map((item, index) => (
                                  <small key={index} className="d-block">
                                    {item.quantity}x {item.productId?.name || 'Product'}
                                  </small>
                                ))}
                                {order.items.length > 2 && (
                                  <small className="text-muted">
                                    +{order.items.length - 2} more items
                                  </small>
                                )}
                              </div>
                            </td>
                            <td className="fw-bold" style={{ color: '#E91E63' }}>
                              ${order.total?.toFixed(2) || '0.00'}
                            </td>
                            <td>
                              <span className={`badge ${
                                order.status === 'completed' ? 'bg-success' :
                                order.status === 'preparing' ? 'bg-warning' :
                                order.status === 'pending' ? 'bg-info' :
                                'bg-secondary'
                              }`}>
                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm" style={{ borderColor: '#F8BBD9' }}>
              <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>
                  <i className="bi bi-sliders me-2"></i>
                  Account Preferences
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <h6 style={{ color: '#E91E63' }}>Communication Preferences</h6>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="newsletter"
                        name="preferences.newsletter"
                        checked={profileData.preferences.newsletter}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="newsletter">
                        Subscribe to newsletter
                      </label>
                      <div className="form-text">Get updates about new products and special offers</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="notifications"
                        name="preferences.notifications"
                        checked={profileData.preferences.notifications}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="notifications">
                        Order notifications
                      </label>
                      <div className="form-text">Receive notifications about your order status</div>
                    </div>
                  </div>

                  <hr />

                  <h6 style={{ color: '#E91E63' }}>Dietary Information</h6>
                  <div className="mb-3">
                    <label className="form-label">Dietary Restrictions (Optional)</label>
                    <div className="form-text mb-2">
                      Help us serve you better by letting us know about any dietary restrictions
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="gluten-free" />
                          <label className="form-check-label" htmlFor="gluten-free">
                            Gluten-free
                          </label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="vegan" />
                          <label className="form-check-label" htmlFor="vegan">
                            Vegan
                          </label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="vegetarian" />
                          <label className="form-check-label" htmlFor="vegetarian">
                            Vegetarian
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="dairy-free" />
                          <label className="form-check-label" htmlFor="dairy-free">
                            Dairy-free
                          </label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="nut-free" />
                          <label className="form-check-label" htmlFor="nut-free">
                            Nut-free
                          </label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="sugar-free" />
                          <label className="form-check-label" htmlFor="sugar-free">
                            Sugar-free
                          </label>
                        </div>
                      </div>
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
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Save Preferences
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
