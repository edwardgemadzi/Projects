import React, { useState } from 'react';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await contactAPI.send(formData);
      
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      {/* Header */}
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="section-title">Contact Us</h1>
          <p className="lead">
            We'd love to hear from you! Get in touch with any questions, special requests, or feedback.
          </p>
        </div>
      </div>

      <div className="row">
        {/* Contact Form */}
        <div className="col-lg-8 mb-5">
          <div className="card shadow-sm" style={{ borderColor: '#F8BBD9' }}>
            <div className="card-body">
              <h3 className="card-title mb-4" style={{ color: '#E91E63' }}>Send us a Message</h3>
              
              {success && (
                <div className="alert alert-success border-0 shadow-sm" style={{ backgroundColor: '#F8BBD9', color: '#E91E63' }}>
                  <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon!
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger border-0 shadow-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderColor: '#F8BBD9', ':focus': { borderColor: '#E91E63', boxShadow: '0 0 0 0.2rem rgba(233, 30, 99, 0.25)' } }}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
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
                </div>
                
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    style={{ borderColor: '#F8BBD9' }}
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Tell us about your inquiry, special order request, or any questions you have..."
                  ></textarea>
                </div>
                
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
                      Sending...
                    </>
                  ) : (
                    '💌 Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="col-lg-4">
          <div className="card contact-info-card mb-3 shadow-sm" style={{ borderColor: '#F8BBD9' }}>
            <div className="card-body">
              <h5 className="card-title mb-2" style={{ color: '#E91E63', fontSize: '1.1rem' }}>📍 Visit Our Bakery</h5>
              <address className="mb-0" style={{ lineHeight: '1.4', fontSize: '0.9rem' }}>
                123 Baker Street<br />
                City, State 12345<br />
                United States
              </address>
            </div>
          </div>

          <div className="card contact-info-card mb-3 shadow-sm" style={{ borderColor: '#F8BBD9' }}>
            <div className="card-body">
              <h5 className="card-title mb-2" style={{ color: '#E91E63', fontSize: '1.1rem' }}>📞 Call Us</h5>
              <p className="mb-0">
                <a 
                  href="tel:+15551234567" 
                  className="text-decoration-none"
                  style={{ color: '#E91E63', fontWeight: '500', fontSize: '0.9rem' }}
                >
                  (555) 123-4567
                </a>
              </p>
            </div>
          </div>

          <div className="card contact-info-card mb-3 shadow-sm" style={{ borderColor: '#F8BBD9' }}>
            <div className="card-body">
              <h5 className="card-title mb-2" style={{ color: '#E91E63', fontSize: '1.1rem' }}>✉️ Email Us</h5>
              <p className="mb-0">
                <a 
                  href="mailto:info@lamadrinabakery.com" 
                  className="text-decoration-none"
                  style={{ color: '#E91E63', fontWeight: '500', fontSize: '0.9rem', wordBreak: 'break-word' }}
                >
                  info@lamadrinabakery.com
                </a>
              </p>
            </div>
          </div>

          <div className="card contact-info-card mb-3 shadow-sm" style={{ borderColor: '#F8BBD9' }}>
            <div className="card-body">
              <h5 className="card-title mb-2" style={{ color: '#E91E63', fontSize: '1.1rem' }}>🕒 Hours</h5>
              <ul className="list-unstyled mb-0" style={{ lineHeight: '1.4', fontSize: '0.85rem' }}>
                <li><strong>Mon-Fri:</strong> 6:00 AM - 7:00 PM</li>
                <li><strong>Saturday:</strong> 7:00 AM - 8:00 PM</li>
                <li><strong>Sunday:</strong> 8:00 AM - 6:00 PM</li>
              </ul>
            </div>
          </div>

          <div className="card contact-info-card shadow-sm" style={{ borderColor: '#F8BBD9' }}>
            <div className="card-body">
              <h5 className="card-title mb-2" style={{ color: '#E91E63', fontSize: '1.1rem' }}>🌟 Follow Us</h5>
              <p className="mb-2" style={{ fontSize: '0.85rem' }}>Stay connected for daily specials!</p>
              <div className="d-flex flex-wrap gap-1">
                <a 
                  href="#" 
                  className="btn btn-sm px-2 py-1"
                  style={{ 
                    backgroundColor: '#F8BBD9', 
                    borderColor: '#F8BBD9',
                    color: '#E91E63',
                    fontSize: '0.75rem'
                  }}
                >
                  📘 FB
                </a>
                <a 
                  href="#" 
                  className="btn btn-sm px-2 py-1"
                  style={{ 
                    backgroundColor: '#F8BBD9', 
                    borderColor: '#F8BBD9',
                    color: '#E91E63',
                    fontSize: '0.75rem'
                  }}
                >
                  📷 IG
                </a>
                <a 
                  href="#" 
                  className="btn btn-sm px-2 py-1"
                  style={{ 
                    backgroundColor: '#F8BBD9', 
                    borderColor: '#F8BBD9',
                    color: '#E91E63',
                    fontSize: '0.75rem'
                  }}
                >
                  🐦 Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Requests Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="bg-light p-4 rounded">
            <h3 className="text-center mb-4">Special Orders & Custom Cakes</h3>
            <div className="row">
              <div className="col-md-4 text-center mb-3">
                <div className="display-4 mb-2">🎂</div>
                <h5>Custom Cakes</h5>
                <p>Birthday cakes, wedding cakes, and special occasion desserts made to order.</p>
              </div>
              <div className="col-md-4 text-center mb-3">
                <div className="display-4 mb-2">🥖</div>
                <h5>Bulk Orders</h5>
                <p>Large quantities for events, offices, or special gatherings.</p>
              </div>
              <div className="col-md-4 text-center mb-3">
                <div className="display-4 mb-2">⭐</div>
                <h5>Special Requests</h5>
                <p>Dietary accommodations, unique flavors, or custom recipes.</p>
              </div>
            </div>
            <div className="text-center">
              <p><strong>Planning something special?</strong> Contact us at least 48 hours in advance for custom orders.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
