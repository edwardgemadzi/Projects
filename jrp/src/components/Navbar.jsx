import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../hooks/useRole';
import { useNotification } from './ui/NotificationProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isAdmin, isEmployer, isJobseeker } = useRole();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    showNotification('You have been logged out successfully.', 'success');
    navigate('/login');
  };

  const handleLinkClick = () => {
    setIsCollapsed(true);
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/" onClick={handleLinkClick}>
          <i className="fas fa-briefcase me-2"></i>
          JRP
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                {isJobseeker && (
                  <>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link ${isActiveLink('/jobs')}`} 
                        to="/jobs" 
                        onClick={handleLinkClick}
                      >
                        <i className="fas fa-search me-1"></i>
                        Browse Jobs
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link ${isActiveLink('/applications')}`} 
                        to="/applications" 
                        onClick={handleLinkClick}
                      >
                        <i className="fas fa-file-alt me-1"></i>
                        My Applications
                      </Link>
                    </li>
                  </>
                )}
                {isEmployer && (
                  <>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link ${isActiveLink('/employer')}`} 
                        to="/employer" 
                        onClick={handleLinkClick}
                      >
                        <i className="fas fa-chart-line me-1"></i>
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link ${isActiveLink('/post-job')}`} 
                        to="/post-job" 
                        onClick={handleLinkClick}
                      >
                        <i className="fas fa-plus-circle me-1"></i>
                        Post Job
                      </Link>
                    </li>
                  </>
                )}
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link ${isActiveLink('/admin')}`} 
                        to="/admin" 
                        onClick={handleLinkClick}
                      >
                        <i className="fas fa-tachometer-alt me-1"></i>
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link ${isActiveLink('/admin/users')}`} 
                        to="/admin/users" 
                        onClick={handleLinkClick}
                      >
                        <i className="fas fa-users me-1"></i>
                        Manage Users
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link ${isActiveLink('/admin/reports')}`} 
                        to="/admin/reports" 
                        onClick={handleLinkClick}
                      >
                        <i className="fas fa-chart-bar me-1"></i>
                        Reports
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link ${isActiveLink('/admin/settings')}`} 
                        to="/admin/settings" 
                        onClick={handleLinkClick}
                      >
                        <i className="fas fa-cog me-1"></i>
                        Settings
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle d-flex align-items-center" 
                    href="#" 
                    id="userDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <i className="fas fa-user-circle me-1"></i>
                    {user.name || user.email}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/profile" 
                        onClick={handleLinkClick}
                      >
                        <i className="fas fa-user me-2"></i>
                        Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActiveLink('/login')}`} 
                    to="/login" 
                    onClick={handleLinkClick}
                  >
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`btn btn-outline-light ms-2 ${isActiveLink('/register')}`} 
                    to="/register" 
                    onClick={handleLinkClick}
                  >
                    <i className="fas fa-user-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;