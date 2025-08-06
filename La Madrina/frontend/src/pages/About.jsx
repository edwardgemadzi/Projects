import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      {/* Header */}
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="section-title">About La Madrina Bakery</h1>
          <p className="lead">
            A story of tradition, passion, and the art of baking
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="row mb-5">
        <div className="col-md-6">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkNFNEVDIi8+Cjx0ZXh0IHg9IjMwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNFOTFFNjMiPkxhIE1hZHJpbmE8L3RleHQ+Cjx0ZXh0IHg9IjMwMCIgeT0iMjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNFOTFFNjMiPkJha2VyeSBTdG9yeTwvdGV4dD4KPHN2ZyB4PSIyNzAiIHk9IjI0MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiNFOTFFNjMiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz4KPHN2Zz4KPC9zdmc+"
            className="img-fluid rounded shadow"
            alt="Our Story"
            onError={(e) => {
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhCQkQ5Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNFOTFFNjMiPk91ciBTdG9yeSBJbWFnZTwvdGV4dD4KPC9zdmc+";
            }}
          />
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <h2 className="mb-4">Our Story</h2>
            <p>
              La Madrina Bakery was founded in 1995 by Maria Gonzalez, affectionately known as "La Madrina" 
              (The Godmother) in our community. What started as a small neighborhood bakery has grown into 
              a beloved institution, serving generations of families with authentic, artisan baked goods.
            </p>
            <p>
              Maria brought her family's traditional recipes from her homeland, passing down centuries-old 
              techniques that create the unique flavors and textures our customers have come to love. Every 
              loaf of bread, every pastry, and every cake is made with the same care and attention that 
              Maria put into her very first batch over 25 years ago.
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="row mb-5">
        <div className="col-md-6 order-md-2">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkNFNEVDIi8+Cjx0ZXh0IHg9IjMwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNFOTFFNjMiPk91ciBNaXNzaW9uPC90ZXh0Pgo8c3ZnIHg9IjI3MCIgeT0iMjIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0U5MUU2MyI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPgo8L3N2Zz4KPC9zdmc+"
            className="img-fluid rounded shadow"
            alt="Our Mission"
            onError={(e) => {
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhCQkQ5Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNFOTFFNjMiPk91ciBNaXNzaW9uIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";
            }}
          />
        </div>
        <div className="col-md-6 order-md-1 d-flex align-items-center">
          <div>
            <h2 className="mb-4">Our Mission</h2>
            <p>
              At La Madrina Bakery, our mission is simple: to bring joy to our community through exceptional 
              baked goods made with love, tradition, and the finest ingredients. We believe that food has the 
              power to bring people together, create memories, and celebrate life's special moments.
            </p>
            <p>
              We are committed to preserving traditional baking methods while embracing innovation to serve 
              our diverse community better. Every day, we strive to be more than just a bakery – we aim to 
              be a place where neighbors become friends and every visit feels like coming home.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="section-title">Our Values</h2>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <div className="display-4 mb-3">🌱</div>
              <h5 className="card-title">Quality</h5>
              <p className="card-text">
                We source only the finest, locally-grown ingredients and use traditional methods 
                to ensure every product meets our high standards.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <div className="display-4 mb-3">🤝</div>
              <h5 className="card-title">Community</h5>
              <p className="card-text">
                We are deeply rooted in our community, supporting local farmers, suppliers, 
                and neighbors who make our success possible.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <div className="display-4 mb-3">🏺</div>
              <h5 className="card-title">Tradition</h5>
              <p className="card-text">
                We honor time-tested recipes and techniques while embracing innovation 
                to serve our customers better every day.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="section-title">Meet Our Team</h2>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkNFNEVDIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiNFOTFFNjMiLz4KPHBhdGggZD0iTTE1MCAyMDBjLTQwIDAtNzAtMjAtNzAtNDBzMzAtNDAgNzAtNDBzNzAgMjAgNzAgNDBzLTMwIDQwLTcwIDQweiIgZmlsbD0iI0U5MUU2MyIvPgo8dGV4dCB4PSIxNTAiIHk9IjI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRTkxRTYzIj5NYXJpYSBHLjwvdGV4dD4KPC9zdmc+"
              className="card-img-top"
              alt="Maria Gonzalez"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhCQkQ5Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNFOTFFNjMiPk1hcmlhIEcuPC90ZXh0Pgo8L3N2Zz4=";
              }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">Maria Gonzalez</h5>
              <p className="text-muted">Founder & Head Baker</p>
              <p className="card-text">
                The heart and soul of La Madrina Bakery, Maria brings over 30 years of baking 
                expertise and endless passion to every creation.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkNFNEVDIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiNFOTFFNjMiLz4KPHBhdGggZD0iTTE1MCAyMDBjLTQwIDAtNzAtMjAtNzAtNDBzMzAtNDAgNzAtNDBzNzAgMjAgNzAgNDBzLTMwIDQwLTcwIDQweiIgZmlsbD0iI0U5MUU2MyIvPgo8dGV4dCB4PSIxNTAiIHk9IjI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRTkxRTYzIj5DYXJsb3MgRy48L3RleHQ+Cjwvc3ZnPg=="
              className="card-img-top"
              alt="Carlos Gonzalez"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhCQkQ5Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNFOTFFNjMiPkNhcmxvcyBHLjwvdGV4dD4KPC9zdmc+";
              }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">Carlos Gonzalez</h5>
              <p className="text-muted">Master Baker</p>
              <p className="card-text">
                Maria's son and our master baker, Carlos learned the craft from his mother and 
                continues the family tradition with his own innovative touches.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkNFNEVDIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiNFOTFFNjMiLz4KPHBhdGggZD0iTTE1MCAyMDBjLTQwIDAtNzAtMjAtNzAtNDBzMzAtNDAgNzAtNDBzNzAgMjAgNzAgNDBzLTMwIDQwLTcwIDQweiIgZmlsbD0iI0U5MUU2MyIvPgo8dGV4dCB4PSIxNTAiIHk9IjI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRTkxRTYzIj5BbmEgUi48L3RleHQ+Cjwvc3ZnPg=="
              className="card-img-top"
              alt="Ana Rodriguez"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhCQkQ5Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNFOTFFNjMiPkFuYSBSLjwvdGV4dD4KPC9zdmc+";
              }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">Ana Rodriguez</h5>
              <p className="text-muted">Pastry Chef</p>
              <p className="card-text">
                Our talented pastry chef Ana creates beautiful cakes and delicate pastries that 
                are as stunning to look at as they are delicious to eat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Us */}
      <div className="row">
        <div className="col-12">
          <div className="bg-light p-5 rounded text-center">
            <h2>Visit Our Bakery</h2>
            <p className="lead mb-4">
              Experience the warmth and tradition of La Madrina Bakery in person. 
              We'd love to welcome you to our family!
            </p>
            <div className="row">
              <div className="col-md-6">
                <h5>Location</h5>
                <p>
                  📍 123 Baker Street<br />
                  City, State 12345
                </p>
              </div>
              <div className="col-md-6">
                <h5>Hours</h5>
                <p>
                  Monday - Friday: 6:00 AM - 7:00 PM<br />
                  Saturday: 7:00 AM - 8:00 PM<br />
                  Sunday: 8:00 AM - 6:00 PM
                </p>
              </div>
            </div>
            <a href="/contact" className="btn btn-primary btn-lg mt-3">
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
