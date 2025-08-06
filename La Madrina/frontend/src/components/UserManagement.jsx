import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter })
      });

      const response = await fetch(`/api/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" style={{ color: '#E91E63' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h2 style={{ color: '#E91E63' }}>
            <i className="bi bi-people me-2"></i>
            User Management
          </h2>
        </div>
        <div className="col-md-6 text-end">
          <button 
            className="btn"
            style={{
              backgroundColor: '#E91E63',
              borderColor: '#E91E63',
              color: 'white'
            }}
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-person-plus me-2"></i>
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderColor: '#F8BBD9' }}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ borderColor: '#F8BBD9' }}
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="baker">Baker</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="col-md-3">
          <button 
            className="btn btn-outline-secondary w-100" 
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('');
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                          style={{ width: '40px', height: '40px', fontSize: '16px', color: 'white' }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold">{user.name}</div>
                          {user.phone && <small className="text-muted">{user.phone}</small>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{user.email}</div>
                      {user.isEmailVerified ? (
                        <small className="text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Verified
                        </small>
                      ) : (
                        <small className="text-warning">
                          <i className="bi bi-exclamation-circle me-1"></i>
                          Unverified
                        </small>
                      )}
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        style={{ borderColor: '#F8BBD9' }}
                      >
                        <option value="customer">Customer</option>
                        <option value="baker">Baker</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className={`btn btn-sm ${user.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          <i className={`bi ${user.isActive ? 'bi-pause' : 'bi-play'}`}></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setEditingUser(user)}
                          title="Edit User"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(index + 1)}
                      style={{
                        backgroundColor: currentPage === index + 1 ? '#E91E63' : 'transparent',
                        borderColor: '#E91E63',
                        color: currentPage === index + 1 ? 'white' : '#E91E63'
                      }}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Create User Modal would go here */}
      {/* Edit User Modal would go here */}
    </div>
  );
};

export default UserManagement;
