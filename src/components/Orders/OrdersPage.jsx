import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderService from '../../services/orderService';
import './OrdersPage.css';

const OrdersPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        // Fetch real orders from API
        const fetchedOrders = await OrderService.getUserOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  // Filter orders by time period
  const filterOrdersByTime = () => {
    if (timeFilter === 'all') return orders;
    
    const now = new Date();
    let startDate;
    
    switch (timeFilter) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'three-months':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return orders;
    }
    
    return orders.filter(order => new Date(order.createdAt) >= startDate);
  };

  // Filter orders by status
  const filterOrdersByStatus = (filteredOrders) => {
    if (orderStatusFilter === 'all') return filteredOrders;
    return filteredOrders.filter(order => order.status?.toLowerCase() === orderStatusFilter);
  };

  // Apply both filters
  const filteredOrders = filterOrdersByStatus(filterOrdersByTime());

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    if (!status) return '';
    
    switch (status.toLowerCase()) {
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="not-authenticated">
        <h2>Please log in to view your orders</h2>
        <Link to="/login" className="login-btn">Log In</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>View and track your order history</p>
      </div>
      
      <div className="orders-container">
        {loading ? (
          <div className="orders-loading-spinner">
            <div className="orders-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="orders-error-message">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="order-filters">
              <div className="filter-group">
                <label htmlFor="time-filter">Time Period:</label>
                <select 
                  id="time-filter" 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="three-months">Last 3 Months</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="status-filter">Order Status:</label>
                <select 
                  id="status-filter" 
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            {filteredOrders.length === 0 ? (
              <div className="no-orders">
                <h3>No orders found</h3>
                <p>You don't have any orders in the selected time period.</p>
                <Link to="/products" className="browse-products-btn">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order._id.substring(0, 8)}</h3>
                        <p className="order-date">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status || 'Processing'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items?.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="item-image">
                            <img 
                              src={item.product?.images?.[0] || 'https://via.placeholder.com/80'} 
                              alt={item.product?.name || 'Product'} 
                            />
                          </div>
                          <div className="item-details">
                            <h4>{item.product?.name || 'Product'}</h4>
                            <p>Qty: {item.quantity} × ${item.price?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div className="item-price">
                            ${(item.price * item.quantity).toFixed(2) || '0.00'}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>${order.subtotal?.toFixed(2) || order.itemsPrice?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="summary-row">
                        <span>Tax:</span>
                        <span>${order.tax?.toFixed(2) || order.taxPrice?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="summary-row">
                        <span>Shipping:</span>
                        <span>
                          {(order.shippingCost === 0 || order.shippingPrice === 0) 
                            ? 'Free' 
                            : `$${order.shippingCost?.toFixed(2) || order.shippingPrice?.toFixed(2) || '0.00'}`
                          }
                        </span>
                      </div>
                      <div className="summary-row total">
                        <span>Total:</span>
                        <span>${order.totalPrice?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                    
                    <div className="order-actions">
                      <Link to={`/orders/${order._id}`} className="view-order-btn">
                        View Details
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="review-order-btn">
                          Write a Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 