import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderId = localStorage.getItem('lastOrderId');
        
        if (!orderId) {
          setError('Order information not found');
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
  }, []);

  if (loading) {
    return (
      <div className="order-confirmation loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-confirmation error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <Link to="/shop" className="button">Return to Shop</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation error">
        <h2>Order Not Found</h2>
        <p>We couldn't find your order information.</p>
        <Link to="/shop" className="button">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>Thank You For Your Order!</h1>
        <p className="order-id">Order #{order._id}</p>
        <p className="confirmation-message">
          We've sent a confirmation email to your registered email address.
        </p>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        
        <div className="order-items">
          <h3>Items Ordered</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={index}>
                  <td className="product-info">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </td>
                  <td className="quantity">{item.quantity}</td>
                  <td className="price">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="item-total">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-details-grid">
          <div className="shipping-details">
            <h3>Shipping Details</h3>
            <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
            <p><strong>Address:</strong> {order.shippingAddress.address}</p>
            <p><strong>City:</strong> {order.shippingAddress.city}</p>
            <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
            <p><strong>Country:</strong> {order.shippingAddress.country}</p>
            <p><strong>Phone:</strong> {order.shippingAddress.phoneNumber}</p>
          </div>

          <div className="payment-details">
            <h3>Payment Details</h3>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Payment Status:</strong> {order.isPaid ? 'Paid' : 'Pending'}</p>
            {order.isPaid && <p><strong>Paid On:</strong> {new Date(order.paidAt).toLocaleDateString()}</p>}
            <p><strong>Order Status:</strong> {order.status}</p>
          </div>
        </div>

        <div className="price-summary">
          <div className="price-row">
            <span>Subtotal:</span>
            <span>${parseFloat(order.itemsPrice).toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Shipping:</span>
            <span>${parseFloat(order.shippingPrice).toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Tax:</span>
            <span>${parseFloat(order.taxPrice).toFixed(2)}</span>
          </div>
          <div className="price-row total">
            <span>Total:</span>
            <span>${parseFloat(order.totalPrice).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <Link to="/shop" className="button">Continue Shopping</Link>
        <Link to="/account/orders" className="button secondary">View All Orders</Link>
      </div>
    </div>
  );
};

export default OrderConfirmation; 