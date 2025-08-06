import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>Welcome to La Madrina Bakery</h1>
              <p className="lead">
                Artisan baked goods made with love, tradition, and the finest ingredients
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/menu" className="btn btn-light btn-lg">
                  💗 View Our Menu
                </Link>
                <Link to="/contact" className="btn btn-outline-light btn-lg">
                  💌 Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title">Why Choose La Madrina?</h2>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <div className="display-4 mb-3">🥖</div>
                  <h5 className="card-title">Fresh Daily</h5>
                  <p className="card-text">
                    All our breads and pastries are baked fresh every morning using traditional methods.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <div className="display-4 mb-3">🌟</div>
                  <h5 className="card-title">Quality Ingredients</h5>
                  <p className="card-text">
                    We use only the finest, locally-sourced ingredients to ensure exceptional taste and quality.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <div className="display-4 mb-3">👨‍🍳</div>
                  <h5 className="card-title">Master Bakers</h5>
                  <p className="card-text">
                    Our experienced bakers bring decades of expertise and passion to every creation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-5 pink-bg">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title">Featured Products</h2>
            </div>
          </div>
          
          <div id="featuredCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#featuredCarousel" data-bs-slide-to="0" className="active"></button>
              <button type="button" data-bs-target="#featuredCarousel" data-bs-slide-to="1"></button>
              <button type="button" data-bs-target="#featuredCarousel" data-bs-slide-to="2"></button>
            </div>
            
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row">
                  <div className="col-md-6">
                    <img 
                      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&crop=center" 
                      className="d-block w-100 rounded" 
                      alt="Artisan Breads"
                    />
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <div>
                      <h3>Artisan Breads</h3>
                      <p className="lead">
                        From classic sourdough to specialty grain breads, each loaf is crafted with care and baked to perfection.
                      </p>
                      <Link to="/menu" className="btn btn-pink">
                        💗 Shop Breads
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="carousel-item">
                <div className="row">
                  <div className="col-md-6">
                    <img 
                      src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=400&fit=crop&crop=center" 
                      className="d-block w-100 rounded" 
                      alt="Custom Cakes"
                    />
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <div>
                      <h3>Custom Cakes</h3>
                      <p className="lead">
                        Celebrate special occasions with our beautiful custom cakes, made to order for your perfect moment.
                      </p>
                      <Link to="/contact" className="btn btn-pink">
                        🎂 Order Custom Cake
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="carousel-item">
                <div className="row">
                  <div className="col-md-6">
                    <img 
                      src="https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&h=400&fit=crop&crop=center" 
                      className="d-block w-100 rounded" 
                      alt="Fresh Pastries"
                    />
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <div>
                      <h3>Fresh Pastries</h3>
                      <p className="lead">
                        Start your morning right with our flaky croissants, danishes, and other delicious pastries.
                      </p>
                      <Link to="/menu" className="btn btn-pink">
                        🥐 View Pastries
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="carousel-control-prev" type="button" data-bs-target="#featuredCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#featuredCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="section-title">Ready to Taste the Difference?</h2>
              <p className="lead mb-4">
                Visit us today and discover why La Madrina Bakery is the neighborhood's favorite bakery.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/menu" className="btn btn-primary btn-lg">
                  Browse Menu
                </Link>
                <Link to="/order" className="btn btn-outline-primary btn-lg">
                  Place Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
