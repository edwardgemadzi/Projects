import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CartIcon from './CartIcon';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Reset dropdown state when user changes
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [isAuthenticated, user]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <>
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm" style={{ backgroundColor: 'white' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          💗 La Madrina Bakery
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: 'white' }}
        >
          <span className="navbar-toggler-icon" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='m4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`
          }}></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/menu')}`} to="/menu">
                Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/about')}`} to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/contact')}`} to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/track')}`} to="/track">
                Track Order
              </Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            {/* Cart Icon */}
            <CartIcon />
            
            {/* Authentication */}
            {isAuthenticated ? (
              <div className="dropdown" key={user?.id || 'user-dropdown'}>
                <button 
                  className="btn dropdown-toggle"
                  type="button" 
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  style={{ 
                    border: 'none', 
                    background: 'transparent',
                    color: '#E91E63',
                    fontWeight: '500'
                  }}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user?.name || 'User'}
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}>
                  <li><h6 className="dropdown-header">Hello, {user?.name}!</h6></li>
                  <li><hr className="dropdown-divider" /></li>
                  
                  {/* Role-based menu items */}
                  {user?.role === 'admin' && (
                    <>
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <i className="bi bi-speedometer2 me-2"></i>
                          Admin Dashboard
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}
                  
                  {/* Customer profile for all users */}
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </Link>
                  </li>
                  
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <button 
                  onClick={openLoginModal}
                  className="btn btn-sm me-2"
                  style={{ 
                    backgroundColor: 'transparent',
                    borderColor: '#E91E63',
                    color: '#E91E63',
                    border: '1px solid #E91E63',
                    fontWeight: '500'
                  }}
                >
                  Login
                </button>
                <button 
                  onClick={openRegisterModal}
                  className="btn btn-sm"
                  style={{ 
                    backgroundColor: '#E91E63',
                    borderColor: '#E91E63',
                    color: 'white',
                    fontWeight: '500'
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

    {/* Modals */}
    <LoginModal 
      isOpen={isLoginModalOpen} 
      onClose={closeModals} 
      onSwitchToRegister={openRegisterModal} 
    />
    <RegisterModal 
      isOpen={isRegisterModalOpen} 
      onClose={closeModals} 
      onSwitchToLogin={openLoginModal} 
    />
  </>
  );
};

export default Navbar;
