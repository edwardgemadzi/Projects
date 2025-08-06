import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
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

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      onClose();
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
        style={{ zIndex: 1040 }}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div 
        className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow-lg"
        style={{ 
          zIndex: 1050,
          width: '90%',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div className="p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0" style={{ color: '#E91E63' }}>Join La Madrina!</h4>
            <button 
              className="btn-close" 
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger border-0 shadow-sm mb-3">
              <small>{error}</small>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                style={{ borderColor: '#F8BBD9' }}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Your full name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                style={{ borderColor: '#F8BBD9' }}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                style={{ borderColor: '#F8BBD9' }}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                style={{ borderColor: '#F8BBD9' }}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Confirm your password"
              />
            </div>

            <div className="d-grid mb-3">
              <button 
                type="submit" 
                className="btn btn-lg"
                style={{
                  backgroundColor: '#E91E63',
                  borderColor: '#E91E63',
                  color: 'white'
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="text-center">
            <p className="text-muted mb-0">
              Already have an account?{' '}
              <button 
                className="btn btn-link p-0"
                style={{ color: '#E91E63', textDecoration: 'none' }}
                onClick={onSwitchToLogin}
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterModal;
