import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderService from '../../services/orderService';
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!isAuthenticated) {
          setLoading(false);
          return; // Don't fetch if not authenticated
        }
        
        if (!orderId) {
          setError('Order ID is missing');
          setLoading(false);
          return;
        }
        
        const orderData = await OrderService.getOrderById(orderId);
        
        // Validate the response data
        if (!orderData || typeof orderData !== 'object') {
          throw new Error('Invalid order data received');
        }
        
        console.log('Order data received:', orderData); // Debug log
        setOrder(orderData);
        setError(null);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, isAuthenticated]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
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
        <h2>Please log in to view order details</h2>
        <Link to="/login" className="login-btn">Log In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="order-detail-container">
        <div className="order-loading-spinner">
          <div className="order-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-container">
        <div className="order-error-message">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/orders')} className="back-to-orders">
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="order-not-found">
          <h2>Order Not Found</h2>
          <p>We couldn't find the order you're looking for.</p>
          <Link to="/orders" className="back-to-orders">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  // Safely get the order ID for display - handle both string and object IDs
  const displayOrderId = typeof order._id === 'string' 
    ? order._id.substring(0, 8) 
    : (order._id && order._id.toString ? order._id.toString().substring(0, 8) : 'Unknown');

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <h1>Order Details</h1>
        <p>Review the details of your order</p>
      </div>
      
      <div className="order-detail-card">
        <div className="order-header">
          <div>
            <h2>Order #{displayOrderId}</h2>
            <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="order-status">
            <span className={`status-badge ${getStatusClass(order.status)}`}>
              {order.status || 'Processing'}
            </span>
          </div>
        </div>
        
        <div className="order-items-section">
          <h3>Items</h3>
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
        
        <div className="order-info-section">
          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <p><strong>Name:</strong> {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
            <p><strong>Address:</strong> {order.shippingAddress?.address}</p>
            <p><strong>City:</strong> {order.shippingAddress?.city}</p>
            <p><strong>State:</strong> {order.shippingAddress?.state}</p>
            <p><strong>Postal Code:</strong> {order.shippingAddress?.postalCode}</p>
            <p><strong>Phone:</strong> {order.shippingAddress?.phoneNumber}</p>
          </div>
          
          <div className="payment-info">
            <h3>Payment Information</h3>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> {order.isPaid ? 'Paid' : 'Pending'}</p>
            {order.paidAt && <p><strong>Paid On:</strong> {formatDate(order.paidAt)}</p>}
            {order.transactionId && <p><strong>Transaction ID:</strong> {order.transactionId}</p>}
          </div>
        </div>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>${order.tax?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>
              {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2) || '0.00'}`}
            </span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${order.totalPrice?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
        
        <div className="order-actions">
          <button onClick={() => navigate('/orders')} className="back-to-orders">
            Back to My Orders
          </button>
          
          {order.status === 'Processing' && (
            <button className="cancel-order">
              Cancel Order
            </button>
          )}
          
          {order.status === 'Delivered' && (
            <button className="write-review">
              Write a Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 