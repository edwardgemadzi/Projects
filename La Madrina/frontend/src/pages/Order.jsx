import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';

const Order = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll();
      console.log('Products response:', response.data); // Debug log
      const productsData = response.data.data || response.data || [];
      
      // If no products from API, use sample data for demo
      if (productsData.length === 0) {
        const sampleProducts = [
          {
            _id: 'sample1',
            name: 'Classic Croissant',
            description: 'Buttery, flaky croissant baked fresh daily',
            price: 3.99,
            category: 'Pastries',
            image: '/images/croissant.jpg',
            inStock: true
          },
          {
            _id: 'sample2',
            name: 'Chocolate Chip Cookies',
            description: 'Soft and chewy cookies with premium chocolate chips',
            price: 2.99,
            category: 'Cookies',
            image: '/images/cookies.jpg',
            inStock: true
          },
          {
            _id: 'sample3',
            name: 'Fresh Sourdough Bread',
            description: 'Artisan sourdough bread with a perfect crust',
            price: 6.99,
            category: 'Bread',
            image: '/images/sourdough.jpg',
            inStock: true
          }
        ];
        setProducts(sampleProducts);
      } else {
        setProducts(productsData);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToStep = (stepNumber) => {
    setActiveStep(stepNumber);
    const element = document.getElementById(`step-${stepNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <div className="position-relative">
        <div 
          className="hero-section text-white text-center py-5"
          style={{
            background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="container">
            <h1 className="display-4 fw-bold mb-3">Order from La Madrina</h1>
            <p className="lead mb-4">Authentic Mexican flavors delivered to your door</p>
            
            {/* Order Steps Progress */}
            <div className="row justify-content-center mt-5">
              <div className="col-md-8">
                <div className="d-flex justify-content-between align-items-center">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="d-flex flex-column align-items-center">
                      <div 
                        className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                          activeStep >= step ? 'bg-white text-primary' : 'bg-light bg-opacity-25 text-white'
                        }`}
                        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                        onClick={() => scrollToStep(step)}
                      >
                        <span className="fw-bold">{step}</span>
                      </div>
                      <small className={activeStep >= step ? 'text-white fw-bold' : 'text-white-50'}>
                        {step === 1 && 'Menu'}
                        {step === 2 && 'Cart'}
                        {step === 3 && 'Checkout'}
                      </small>
                    </div>
                  ))}
                  <div className="progress position-absolute" style={{ 
                    top: '25px', 
                    left: '25px', 
                    right: '25px', 
                    height: '2px', 
                    zIndex: 0,
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }}>
                    <div 
                      className="progress-bar bg-white" 
                      style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Step 1: Browse Menu */}
        <section id="step-1" className="mb-5">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title text-center mb-4">
                <span className="badge bg-primary rounded-pill me-2">1</span>
                Browse Our Menu
              </h2>
              <div className="text-center mb-4">
                <p className="text-muted">Choose from our selection of fresh baked goods and artisan treats</p>
              </div>
            </div>
          </div>

          {/* Browse Our Menu */}
          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border" style={{ color: '#E91E63' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading our delicious products...</p>
              </div>
            ) : error ? (
              <div className="col-12 text-center py-5">
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
                <button 
                  className="btn btn-outline-primary"
                  onClick={fetchProducts}
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="bi bi-basket" style={{ fontSize: '3rem', color: '#E91E63' }}></i>
                <h4 className="mt-3">No Products Available</h4>
                <p className="text-muted">Our menu is being updated. Please check back soon!</p>
              </div>
            ) : (
              products.slice(0, 6).map((product) => (
                <div key={product._id} className="col-md-6 col-lg-4">
                  <ProductCard
                    product={product}
                    onAddToCart={() => {
                      addToCart(product, 1);
                      setActiveStep(2);
                      scrollToStep(2);
                    }}
                  />
                </div>
              ))
            )}
          </div>

          {!loading && !error && products.length > 6 && (
            <div className="row mt-4">
              <div className="col-12 text-center">
                <a 
                  href="/menu" 
                  className="btn btn-outline-primary btn-lg"
                >
                  View Full Menu
                </a>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-primary btn-lg"
              onClick={() => scrollToStep(2)}
            >
              View Full Menu & Cart
            </button>
          </div>
        </section>

        {/* Step 2: Cart Review */}
        <section id="step-2" className="mb-5">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title text-center mb-4">
                <span className="badge bg-primary rounded-pill me-2">2</span>
                Review Your Order
              </h2>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body p-0">
                  <Cart showAsPage={true} onProceedToCheckout={() => scrollToStep(3)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: Order Information */}
        <section id="step-3" className="mb-5">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title text-center mb-4">
                <span className="badge bg-primary rounded-pill me-2">3</span>
                Complete Your Order
              </h2>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                  {user ? (
                    <div>
                      <h5 className="mb-3">Order Details</h5>
                      <p className="text-muted">Complete your order information below:</p>
                      
                      <form className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Delivery Address</label>
                          <textarea 
                            className="form-control" 
                            rows="3" 
                            placeholder="Enter your delivery address"
                          ></textarea>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone Number</label>
                          <input 
                            type="tel" 
                            className="form-control" 
                            placeholder="(555) 123-4567"
                          />
                          
                          <label className="form-label mt-3">Special Instructions</label>
                          <textarea 
                            className="form-control" 
                            rows="2" 
                            placeholder="Any special requests?"
                          ></textarea>
                        </div>
                        
                        <div className="col-12">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="terms" />
                            <label className="form-check-label" htmlFor="terms">
                              I agree to the <a href="#" className="text-primary">terms and conditions</a>
                            </label>
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary btn-lg w-100">
                            Place Order
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-person-circle" style={{ fontSize: '3rem', color: '#E91E63' }}></i>
                      <h5 className="mt-3">Please Login to Continue</h5>
                      <p className="text-muted">You need to be logged in to place an order</p>
                      <button className="btn btn-primary">
                        Login / Register
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alternative Ordering Methods */}
        <section className="mb-5">
          <div className="row">
            <div className="col-12">
              <h3 className="text-center mb-4">Prefer to Order by Phone?</h3>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card border-0 bg-light h-100 text-center p-4">
                    <i className="bi bi-telephone-fill" style={{ fontSize: '2rem', color: '#E91E63' }}></i>
                    <h5 className="mt-3">Call Us</h5>
                    <p className="text-muted">Order directly over the phone</p>
                    <h4 className="text-primary">(555) 123-MADRE</h4>
                    <small className="text-muted">Mon-Sun: 11AM - 10PM</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 bg-light h-100 text-center p-4">
                    <i className="bi bi-geo-alt-fill" style={{ fontSize: '2rem', color: '#E91E63' }}></i>
                    <h5 className="mt-3">Visit Us</h5>
                    <p className="text-muted">Dine in or pickup in person</p>
                    <address className="mb-0">
                      123 Authentic Street<br/>
                      Mexican Quarter, CA 90210
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Order;
