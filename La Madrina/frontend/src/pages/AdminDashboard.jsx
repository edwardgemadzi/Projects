import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import InventoryManagement from '../components/InventoryManagement';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch user stats
      const statsResponse = await fetch('/api/admin/users/stats', { headers });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      // Fetch recent users
      const usersResponse = await fetch('/api/admin/users?limit=10', { headers });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.data);
      }

      // Fetch recent orders
      const ordersResponse = await fetch('/api/orders', { headers });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.data?.slice(0, 10) || []);
      }

      // Fetch recent contacts
      const contactsResponse = await fetch('/api/contact', { headers });
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData.data?.slice(0, 10) || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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
    <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h3" style={{ color: '#E91E63' }}>
            <i className="bi bi-speedometer2 me-2"></i>
            Admin Dashboard
          </h1>
          <p className="text-muted">Welcome back, {user?.name}! Here's what's happening at La Madrina Bakery.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
                style={{ 
                  backgroundColor: activeTab === 'overview' ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: activeTab === 'overview' ? 'white' : '#E91E63'
                }}
              >
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
                style={{ 
                  backgroundColor: activeTab === 'users' ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: activeTab === 'users' ? 'white' : '#E91E63'
                }}
              >
                Users
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setActiveTab('inventory')}
                style={{ 
                  backgroundColor: activeTab === 'inventory' ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: activeTab === 'inventory' ? 'white' : '#E91E63'
                }}
              >
                <i className="bi bi-boxes me-2"></i>
                Inventory
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
                Orders
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contacts')}
                style={{ 
                  backgroundColor: activeTab === 'contacts' ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: activeTab === 'contacts' ? 'white' : '#E91E63'
                }}
              >
                Messages
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                    👥
                  </div>
                  <h5 className="card-title">Total Users</h5>
                  <h3 className="text-primary">{stats?.overview?.totalUsers || 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                    ✅
                  </div>
                  <h5 className="card-title">Active Users</h5>
                  <h3 className="text-success">{stats?.overview?.activeUsers || 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                    📧
                  </div>
                  <h5 className="card-title">Verified Users</h5>
                  <h3 className="text-info">{stats?.overview?.verifiedUsers || 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                    🛒
                  </div>
                  <h5 className="card-title">Total Orders</h5>
                  <h3 className="text-warning">{orders?.length || 0}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Role Distribution */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                  <h5 className="mb-0" style={{ color: '#E91E63' }}>User Roles</h5>
                </div>
                <div className="card-body">
                  {stats?.roleDistribution?.map((role, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-capitalize">{role._id}</span>
                      <span className="badge bg-primary">{role.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                  <h5 className="mb-0" style={{ color: '#E91E63' }}>Recent Activity</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success rounded-circle p-2 me-3">
                      <i className="bi bi-person-plus text-white"></i>
                    </div>
                    <div>
                      <div className="fw-bold">New User Registrations</div>
                      <small className="text-muted">Users joining your bakery</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-info rounded-circle p-2 me-3">
                      <i className="bi bi-cart-check text-white"></i>
                    </div>
                    <div>
                      <div className="fw-bold">Order Activity</div>
                      <small className="text-muted">Recent customer orders</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-warning rounded-circle p-2 me-3">
                      <i className="bi bi-envelope text-white"></i>
                    </div>
                    <div>
                      <div className="fw-bold">Contact Messages</div>
                      <small className="text-muted">Customer inquiries</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>Recent Users</h5>
                <small className="text-muted">Latest {users.length} users</small>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                                   style={{ width: '32px', height: '32px', fontSize: '14px', color: 'white' }}>
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              {user.name}
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${
                              user.role === 'admin' ? 'bg-danger' :
                              user.role === 'manager' ? 'bg-warning' :
                              user.role === 'baker' ? 'bg-info' : 'bg-secondary'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{formatDate(user.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <InventoryManagement />
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>Recent Orders</h5>
                <small className="text-muted">Latest {orders.length} orders</small>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>{order.customerName}</td>
                          <td>{order.email}</td>
                          <td>{order.items?.length || 0} items</td>
                          <td>{formatPrice(order.total)}</td>
                          <td>{formatDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'contacts' && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>Recent Messages</h5>
                <small className="text-muted">Latest {contacts.length} messages</small>
              </div>
              <div className="card-body">
                {contacts.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-inbox display-4 text-muted"></i>
                    <p className="text-muted mt-2">No messages yet</p>
                  </div>
                ) : (
                  <div className="row">
                    {contacts.map((contact) => (
                      <div key={contact._id} className="col-md-6 mb-3">
                        <div className="card border-0" style={{ backgroundColor: '#F8F9FA' }}>
                          <div className="card-body">
                            <h6 className="card-title">{contact.name}</h6>
                            <p className="card-text text-muted small">{contact.email}</p>
                            <p className="card-text">{contact.message.substring(0, 100)}...</p>
                            <small className="text-muted">{formatDate(contact.createdAt)}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
