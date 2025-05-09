import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderService from '../../services/orderService';
//import AuthService from '../../services/authService';
import config from '../../config';
import './PaymentPage.css';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await OrderService.getOrderById(orderId);
        console.log('Fetched order data:', orderData); // Debug
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Could not load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!paymentData.cardName || !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
      setError('Please fill out all payment fields');
      return;
    }
    
    // Simple card validation (just for demo)
    if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits');
      return;
    }
    
    if (paymentData.cvv.length !== 3) {
      setError('CVV must be 3 digits');
      return;
    }
    
    try {
      setProcessing(true);
      setError('');
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction ID
      const transactionId = `TRANS_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Update order with payment information
      await OrderService.updatePayment(orderId, {
        paymentMethod: "credit-card", // Hardcoded to match the enum in the Order model
        transactionId
      });
      
      // Try to send order confirmation email
      try {
        if (currentUser && currentUser.email) {
          await fetch('/api/email/order-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              email: currentUser.email,
              name: currentUser.name,
              order: order
            })
          });
        }
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Continue even if email fails
      }
      
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  if (loading) {
    return (
      <div className="payment-page loading">
        <div className="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }
  
  if (error && !order) {
    return (
      <div className="payment-page error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/checkout')}>Return to Checkout</button>
      </div>
    );
  }
  
  if (paymentSuccess) {
    return (
      <div className="payment-page success">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>Payment Successful!</h2>
        <p>Your order has been placed successfully.</p>
        <p>Order ID: {orderId}</p>
        <p>Thank you for shopping with PawVot!</p>
        <div className="success-buttons">
          <button onClick={() => navigate('/orders')}>View My Orders</button>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="payment-page">
      <div className="payment-header">
        <h1>Complete Your Payment</h1>
        <p>Order ID: {orderId}</p>
      </div>
      
      <div className="payment-container">
        {error && <div className="payment-error">{error}</div>}
        
        <div className="payment-content">
          <div className="payment-form-section">
            <h2>Payment Details</h2>
            
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-group">
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={paymentData.cardName}
                  onChange={handleInputChange}
                  placeholder="Card Holder Name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setPaymentData({ ...paymentData, cardNumber: formatted });
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
              
              {/* <div className="form-group checkbox">
                <label className="save-card-label">
                  <input
                    type="checkbox"
                    name="saveCard"
                    checked={paymentData.saveCard}
                    onChange={handleInputChange}
                  />
                  <span>Save card for future purchases</span>
                </label>
              </div> */}
              
              <div className="payment-actions">
                <button 
                  type="button" 
                  className="back-to-checkout-btn"
                  onClick={() => navigate('/checkout')}
                  disabled={processing}
                >
                  Back to Checkout
                </button>
                
                <button 
                  type="submit" 
                  className="process-payment-btn"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay $${order?.totalPrice?.toFixed(2) || '0.00'}`}
                </button>
              </div>
            </form>
          </div>
          
          <div className="order-summary-section-payment-page">
            <h2>Order Summary</h2>
            
            <div className="order-items-payment-page">
              {order?.items?.map((item) => (
                <div key={item._id} className="order-item-payment-page">
                  <div className="order-item-image">
                    <img 
                      src={item.product?.images?.[0] ? config.getImageUrl(item.product.images[0]) : 'https://via.placeholder.com/60x60?text=Product'} 
                      alt={item.product?.name} 
                    />
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  <div className="order-item-details">
                    <h4>{item.product?.name}</h4>
                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${order?.subtotal?.toFixed(2) || order?.itemsPrice?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="total-row">
                <span>Shipping</span>
                <span>
                  {(order?.shippingCost === 0 || order?.shippingPrice === 0) 
                    ? 'Free' 
                    : `$${order?.shippingCost?.toFixed(2) || order?.shippingPrice?.toFixed(2) || '0.00'}`
                  }
                </span>
              </div>
              
              <div className="total-row">
                <span>Tax</span>
                <span>${order?.tax?.toFixed(2) || order?.taxPrice?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${order?.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            
            <div className="payment-security">
              <p>
                <span className="secure-icon">🔒</span> 
                Secure payment processing
              </p>
              <div className="payment-methods">
                <span className="payment-method visa">Visa</span>
                <span className="payment-method mastercard">Mastercard</span>
                <span className="payment-method amex">Amex</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 