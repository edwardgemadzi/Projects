import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5>La Madrina Bakery</h5>
            <p>Bringing you the finest artisan baked goods with traditional recipes passed down through generations.</p>
          </div>
          
          <div className="col-md-4 mb-4">
            <h5>Hours</h5>
            <ul className="list-unstyled">
              <li>Monday - Friday: 6:00 AM - 7:00 PM</li>
              <li>Saturday: 7:00 AM - 8:00 PM</li>
              <li>Sunday: 8:00 AM - 6:00 PM</li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-4">
            <h5>Contact Info</h5>
            <ul className="list-unstyled">
              <li>📍 123 Baker Street, City, State 12345</li>
              <li>📞 (555) 123-4567</li>
              <li>✉️ info@lamadrinabakery.com</li>
            </ul>
            
            <div className="mt-3">
              <h6>Follow Us</h6>
              <div className="d-flex gap-3">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="Twitter">🐦</a>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} La Madrina Bakery. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
