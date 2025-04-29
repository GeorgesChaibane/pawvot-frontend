import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load order history');
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class based on order status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'status-badge processing';
      case 'Shipped':
        return 'status-badge shipped';
      case 'Delivered':
        return 'status-badge delivered';
      case 'Cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  };

  if (loading) {
    return (
      <div className="order-history-container loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-container error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history-container empty">
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/shop" className="shop-button">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h2>Your Orders</h2>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order._id}</h3>
                <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className={getStatusBadgeClass(order.status)}>
                {order.status}
              </div>
            </div>
            
            <div className="order-summary">
              <div className="order-items-preview">
                {order.orderItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="item-preview">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.orderItems.length > 3 && (
                  <div className="more-items">
                    +{order.orderItems.length - 3} more
                  </div>
                )}
              </div>
              
              <div className="order-totals">
                <p><strong>Total:</strong> ${parseFloat(order.totalPrice).toFixed(2)}</p>
                <p><strong>Items:</strong> {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
              </div>
            </div>
            
            <div className="order-footer">
              <Link to={`/account/orders/${order._id}`} className="view-details-button">
                View Details
              </Link>
              
              {order.status === 'Processing' && !order.isDelivered && (
                <button 
                  className="cancel-order-button"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
              
              {order.isDelivered && (
                <Link to="/review" className="write-review-button">
                  Write a Review
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Handle cancel order
  async function handleCancelOrder(orderId) {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
      
      // Update the orders list to reflect the cancelled status
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'Cancelled' } 
          : order
      ));
      
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order. Please try again.');
    }
  }
};

export default OrderHistory; 