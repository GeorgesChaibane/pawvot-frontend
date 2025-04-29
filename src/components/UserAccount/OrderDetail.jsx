import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) {
          setError('Order ID is missing');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const orderData = await response.json();
        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);

  // Handle cancel order
  const handleCancelOrder = async () => {
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
      
      // Update the order state to reflect the cancelled status
      setOrder(prevOrder => ({
        ...prevOrder,
        status: 'Cancelled'
      }));
      
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order. Please try again.');
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
      <div className="order-detail-container loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-container error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container error">
        <h2>Order Not Found</h2>
        <p>We couldn't find the order you're looking for.</p>
        <Link to="/account/orders" className="back-button">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <div className="order-title">
          <h2>Order #{order._id}</h2>
          <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className={getStatusBadgeClass(order.status)}>
          {order.status}
        </div>
      </div>

      <div className="order-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${order.progressPercentage}%` }}></div>
        </div>
        <div className="progress-steps">
          <div className={`progress-step ${order.status !== 'Cancelled' ? 'active' : ''}`}>Processing</div>
          <div className={`progress-step ${order.status === 'Shipped' || order.status === 'Delivered' ? 'active' : ''}`}>Shipped</div>
          <div className={`progress-step ${order.status === 'Delivered' ? 'active' : ''}`}>Delivered</div>
        </div>
      </div>

      {order.trackingNumber && (
        <div className="tracking-info">
          <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
          <button className="track-button">Track Package</button>
        </div>
      )}

      <div className="order-detail-grid">
        <div className="order-items">
          <h3>Items Ordered</h3>
          <div className="items-list">
            {order.orderItems.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="item-price">${parseFloat(item.price).toFixed(2)}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary-section">
          <h3>Order Summary</h3>
          <div className="order-summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${parseFloat(order.itemsPrice).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${parseFloat(order.shippingPrice).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${parseFloat(order.taxPrice).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${parseFloat(order.totalPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="order-info-grid">
        <div className="shipping-info">
          <h3>Shipping Information</h3>
          <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
          <p><strong>Address:</strong> {order.shippingAddress.address}</p>
          <p><strong>City:</strong> {order.shippingAddress.city}</p>
          <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
          <p><strong>Country:</strong> {order.shippingAddress.country}</p>
          <p><strong>Phone:</strong> {order.shippingAddress.phoneNumber}</p>
        </div>

        <div className="payment-info">
          <h3>Payment Information</h3>
          <p><strong>Method:</strong> {order.paymentMethod}</p>
          <p><strong>Status:</strong> {order.isPaid ? 'Paid' : 'Pending'}</p>
          {order.isPaid && <p><strong>Paid On:</strong> {formatDate(order.paidAt)}</p>}
          {order.paymentResult && (
            <>
              <p><strong>Transaction ID:</strong> {order.paymentResult.id}</p>
              <p><strong>Payment Status:</strong> {order.paymentResult.status}</p>
            </>
          )}
        </div>
      </div>

      <div className="order-actions">
        <button onClick={() => navigate(-1)} className="back-button">
          Return to Orders
        </button>
        
        {order.status === 'Processing' && !order.isDelivered && (
          <button 
            className="cancel-order-button"
            onClick={handleCancelOrder}
          >
            Cancel Order
          </button>
        )}
        
        {order.isDelivered && (
          <Link to={`/review?orderId=${order._id}`} className="review-button">
            Write Product Reviews
          </Link>
        )}
      </div>
    </div>
  );
};

export default OrderDetail; 