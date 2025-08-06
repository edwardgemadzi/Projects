import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

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
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow" style={{ borderColor: '#E91E63' }}>
            <div className="card-header text-center" style={{ backgroundColor: '#E91E63', color: 'white' }}>
              <h3 className="mb-0">Login</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ borderColor: '#F8BBD9' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ borderColor: '#F8BBD9' }}
                  />
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn" 
                    disabled={loading}
                    style={{ 
                      backgroundColor: '#E91E63', 
                      borderColor: '#E91E63',
                      color: 'white'
                    }}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account? <Link to="/register" style={{ color: '#E91E63' }}>Sign up here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
