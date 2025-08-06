import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      const productsData = response.data.data || [];
      setProducts(productsData);
      
      // Check for low stock alerts
      const lowStockItems = productsData.filter(product => 
        product.stock <= product.lowStockThreshold && product.inStock
      );
      setAlerts(lowStockItems);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      const product = products.find(p => p._id === productId);
      const updatedProduct = {
        ...product,
        stock: newStock,
        inStock: newStock > 0
      };

      await productsAPI.update(productId, updatedProduct);
      
      // Update local state
      setProducts(products.map(p => 
        p._id === productId ? { ...p, stock: newStock, inStock: newStock > 0 } : p
      ));
      
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const toggleStockStatus = async (productId) => {
    try {
      const product = products.find(p => p._id === productId);
      const updatedProduct = {
        ...product,
        inStock: !product.inStock
      };

      await productsAPI.update(productId, updatedProduct);
      
      setProducts(products.map(p => 
        p._id === productId ? { ...p, inStock: !p.inStock } : p
      ));
    } catch (error) {
      console.error('Error toggling stock status:', error);
    }
  };

  const getStockStatusColor = (product) => {
    if (!product.inStock) return 'text-danger';
    if (product.stock <= product.lowStockThreshold) return 'text-warning';
    return 'text-success';
  };

  const getStockStatusText = (product) => {
    if (!product.inStock) return 'Out of Stock';
    if (product.stock <= product.lowStockThreshold) return 'Low Stock';
    return 'In Stock';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#E91E63' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-management">
      {/* Low Stock Alerts */}
      {alerts.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning">
              <h6 className="alert-heading">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Low Stock Alerts ({alerts.length} items)
              </h6>
              <div className="row">
                {alerts.map(product => (
                  <div key={product._id} className="col-md-4 mb-2">
                    <strong>{product.name}</strong>: {product.stock} left
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
              <h5 className="mb-0" style={{ color: '#E91E63' }}>
                <i className="bi bi-boxes me-2"></i>
                Inventory Management
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Current Stock</th>
                      <th>Low Stock Alert</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={product.image || '/images/placeholder.jpg'}
                              alt={product.name}
                              className="rounded me-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold">{product.name}</div>
                              <small className="text-muted">{product.sku || 'No SKU'}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {product.category}
                          </span>
                        </td>
                        <td>
                          {editingProduct === product._id ? (
                            <div className="input-group" style={{ width: '120px' }}>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                defaultValue={product.stock || 0}
                                min="0"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    updateStock(product._id, parseInt(e.target.value));
                                  }
                                }}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <span
                              className={`fw-bold ${getStockStatusColor(product)}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setEditingProduct(product._id)}
                            >
                              {product.stock || 0}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="text-muted">
                            {product.lowStockThreshold || 5}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            product.inStock ? 
                              (product.stock <= product.lowStockThreshold ? 'bg-warning' : 'bg-success') 
                              : 'bg-danger'
                          }`}>
                            {getStockStatusText(product)}
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold">
                            ${product.price?.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => setEditingProduct(
                                editingProduct === product._id ? null : product._id
                              )}
                              title="Edit Stock"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className={`btn ${product.inStock ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => toggleStockStatus(product._id)}
                              title={product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                            >
                              <i className={`bi ${product.inStock ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="card-title text-success">
                {products.filter(p => p.inStock && p.stock > p.lowStockThreshold).length}
              </h5>
              <p className="card-text text-muted">In Stock</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="card-title text-warning">
                {products.filter(p => p.inStock && p.stock <= p.lowStockThreshold).length}
              </h5>
              <p className="card-text text-muted">Low Stock</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-danger">
            <div className="card-body">
              <h5 className="card-title text-danger">
                {products.filter(p => !p.inStock).length}
              </h5>
              <p className="card-text text-muted">Out of Stock</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center" style={{ borderColor: '#E91E63' }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#E91E63' }}>
                {products.length}
              </h5>
              <p className="card-text text-muted">Total Products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
