import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // Small delay to ensure auth state propagates before closing modal
      setTimeout(() => {
        onClose();
        setFormData({ email: '', password: '' });
      }, 100);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-primary">Welcome Back</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          
          <div className="modal-body px-4 pb-4">
            <p className="text-muted mb-4">Sign in to your La Madrina account</p>
            
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError('')}
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    id="loginEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="loginPassword" className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0"
                    id="loginPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="rememberMe" />
                  <label className="form-check-label text-muted" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-primary text-decoration-none small">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mb-3"
                disabled={loading}
                style={{ borderRadius: '8px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="text-center">
              <span className="text-muted">Don't have an account? </span>
              <button
                type="button"
                className="btn btn-link p-0 text-primary fw-bold"
                onClick={onSwitchToRegister}
                disabled={loading}
              >
                Sign up here
              </button>
            </div>

            <div className="row mt-4">
              <div className="col">
                <hr className="my-2" />
                <p className="text-center text-muted small mb-0">Or continue with</p>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <button 
                  type="button" 
                  className="btn btn-outline-dark w-100 py-2"
                  disabled={loading}
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-google me-2"></i>
                  Google
                </button>
              </div>
              <div className="col-6">
                <button 
                  type="button" 
                  className="btn btn-outline-primary w-100 py-2"
                  disabled={loading}
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-facebook me-2"></i>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
