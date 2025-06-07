import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">JobBoard</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/search">Search Jobs</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/post-job">Post Job</Link>
          </li>
        </ul>
        <div>
          <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
          <Link className="btn btn-light" to="/register">Register</Link>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;