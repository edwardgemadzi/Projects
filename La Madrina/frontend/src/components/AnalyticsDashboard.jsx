import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sales');
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchAnalyticsData();
  }, [activeTab, period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      switch (activeTab) {
        case 'sales':
          const salesResponse = await fetch(`/api/analytics/sales?period=${period}`, { headers });
          if (salesResponse.ok) {
            const salesData = await salesResponse.json();
            setSalesData(salesData.data);
          }
          break;
        
        case 'inventory':
          const inventoryResponse = await fetch('/api/analytics/inventory', { headers });
          if (inventoryResponse.ok) {
            const inventoryData = await inventoryResponse.json();
            setInventoryData(inventoryData.data);
          }
          break;
        
        case 'customers':
          const customerResponse = await fetch(`/api/analytics/customers?period=${period}`, { headers });
          if (customerResponse.ok) {
            const customerData = await customerResponse.json();
            setCustomerData(customerData.data);
          }
          break;
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
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
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="h4" style={{ color: '#E91E63' }}>
            <i className="bi bi-graph-up me-2"></i>
            Analytics Dashboard
          </h2>
          <p className="text-muted">Comprehensive business insights and performance metrics</p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <label className="me-3">Period:</label>
            <select 
              className="form-select w-auto"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`}
                onClick={() => setActiveTab('sales')}
                style={{ 
                  backgroundColor: activeTab === 'sales' ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: activeTab === 'sales' ? 'white' : '#E91E63'
                }}
              >
                Sales Analytics
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setActiveTab('inventory')}
                style={{ 
                  backgroundColor: activeTab === 'inventory' ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: activeTab === 'inventory' ? 'white' : '#E91E63'
                }}
              >
                Inventory Analytics
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`}
                onClick={() => setActiveTab('customers')}
                style={{ 
                  backgroundColor: activeTab === 'customers' ? '#E91E63' : 'transparent',
                  borderColor: '#E91E63',
                  color: activeTab === 'customers' ? 'white' : '#E91E63'
                }}
              >
                Customer Analytics
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Sales Analytics */}
      {activeTab === 'sales' && salesData && (
        <div className="row">
          {/* Overview Cards */}
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  💰
                </div>
                <h5 className="card-title">Total Revenue</h5>
                <h3 className="text-success">{formatCurrency(salesData.overview.totalRevenue)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  📦
                </div>
                <h5 className="card-title">Total Orders</h5>
                <h3 className="text-primary">{salesData.overview.totalOrders}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  📊
                </div>
                <h5 className="card-title">Avg Order Value</h5>
                <h3 className="text-info">{formatCurrency(salesData.overview.averageOrderValue)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  💎
                </div>
                <h5 className="card-title">Profit Margin</h5>
                <h3 className="text-warning">{salesData.overview.averageProfitMargin.toFixed(1)}%</h3>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>Top Selling Products</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.topProducts.slice(0, 5).map((product, index) => (
                        <tr key={index}>
                          <td>{product.productName}</td>
                          <td>{product.totalSold}</td>
                          <td>{formatCurrency(product.totalRevenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>Category Performance</h5>
              </div>
              <div className="card-body">
                {salesData.categoryPerformance.map((category, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-capitalize">{category._id}</span>
                    <span className="badge bg-primary">{formatCurrency(category.totalRevenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Analytics */}
      {activeTab === 'inventory' && inventoryData && (
        <div className="row">
          {/* Inventory Overview */}
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  📦
                </div>
                <h5 className="card-title">Total Items</h5>
                <h3 className="text-primary">{inventoryData.inventoryValue.totalItems}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  🏪
                </div>
                <h5 className="card-title">Total Stock</h5>
                <h3 className="text-success">{inventoryData.inventoryValue.totalStock}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  💰
                </div>
                <h5 className="card-title">Inventory Value</h5>
                <h3 className="text-info">{formatCurrency(inventoryData.inventoryValue.totalValue)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  ⚠️
                </div>
                <h5 className="card-title">Low Stock Items</h5>
                <h3 className="text-warning">{inventoryData.lowStockItems.length}</h3>
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>Low Stock Alerts</h5>
              </div>
              <div className="card-body">
                {inventoryData.lowStockItems.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Stock</th>
                          <th>Threshold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryData.lowStockItems.slice(0, 5).map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>
                              <span className={`badge ${item.stock === 0 ? 'bg-danger' : 'bg-warning'}`}>
                                {item.stock}
                              </span>
                            </td>
                            <td>{item.lowStockThreshold}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted mb-0">No low stock items</p>
                )}
              </div>
            </div>
          </div>

          {/* Profit Analysis */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>Profit Analysis</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Average Profit Margin</span>
                  <span className="badge bg-success">{inventoryData.profitAnalysis.averageProfitMargin.toFixed(1)}%</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>High Margin Items (&gt;50%)</span>
                  <span className="badge bg-success">{inventoryData.profitAnalysis.highMarginItems}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Low Margin Items (&lt;30%)</span>
                  <span className="badge bg-warning">{inventoryData.profitAnalysis.lowMarginItems}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Analytics */}
      {activeTab === 'customers' && customerData && (
        <div className="row">
          {/* Customer Overview */}
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  👥
                </div>
                <h5 className="card-title">Total Customers</h5>
                <h3 className="text-primary">{customerData.customerSegments.totalCustomers}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  💰
                </div>
                <h5 className="card-title">Avg Order Value</h5>
                <h3 className="text-success">{formatCurrency(customerData.customerSegments.averageOrderValue)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  🔄
                </div>
                <h5 className="card-title">Returning Customers</h5>
                <h3 className="text-info">{customerData.customerRetention.returningCustomers}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-6 mb-2" style={{ color: '#E91E63' }}>
                  📊
                </div>
                <h5 className="card-title">Avg Orders/Customer</h5>
                <h3 className="text-warning">{customerData.customerRetention.averageOrdersPerCustomer.toFixed(1)}</h3>
              </div>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>Customer Segments</h5>
              </div>
              <div className="card-body">
                {customerData.customerSegments.segments.slice(0, 5).map((customer, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <div className="fw-bold">{customer.customerName}</div>
                      <small className="text-muted">{customer.totalOrders} orders</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{formatCurrency(customer.totalSpent)}</div>
                      <span className={`badge ${
                        customer.segment === 'VIP' ? 'bg-danger' :
                        customer.segment === 'Regular' ? 'bg-success' : 'bg-secondary'
                      }`}>
                        {customer.segment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Acquisition */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header" style={{ backgroundColor: '#F8BBD9' }}>
                <h5 className="mb-0" style={{ color: '#E91E63' }}>Recent Customer Acquisition</h5>
              </div>
              <div className="card-body">
                {customerData.customerAcquisition.slice(-5).map((acquisition, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{formatDate(acquisition._id)}</span>
                    <span className="badge bg-success">{acquisition.newCustomers} new customers</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 