import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  useEffect(() => {
    // Get order details from localStorage
    const storedOrderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    if (storedOrderDetails) {
      setOrderDetails(storedOrderDetails);
      setPaymentMethod(storedOrderDetails.paymentMethod);
    } else {
      // Redirect back to checkout if no order details
      navigate('/checkout');
    }
  }, [navigate]);
  
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const formatCardNumber = (value) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };
  
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({
      ...cardDetails,
      cardNumber: formatted
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order confirmation
      const orderConfirmation = {
        ...orderDetails,
        paymentMethod,
        orderId: `ORD-${Date.now()}`,
        orderDate: new Date().toISOString(),
        status: 'PAID'
      };
      
      // Save order confirmation to localStorage
      localStorage.setItem('orderConfirmation', JSON.stringify(orderConfirmation));
      
      // Clear cart after successful payment
      localStorage.removeItem('cartItems');
      
      // Navigate to confirmation page
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      // Handle payment error
      setIsLoading(false);
    }
  };
  
  if (!orderDetails) return <div className="loading">Loading order details...</div>;
  
  return (
    <div className="payment-container">
      <h1>Payment</h1>
      
      <div className="payment-content">
        <div className="order-details">
          <h2>Order Summary</h2>
          <div className="order-total">
            <span>Total Amount:</span>
            <span className="price">${(orderDetails.subtotal + orderDetails.shipping).toFixed(2)}</span>
          </div>
          
          <div className="shipping-address">
            <h3>Shipping Address</h3>
            <p>{orderDetails.shippingInfo.fullName}</p>
            <p>{orderDetails.shippingInfo.address}</p>
            <p>{orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} {orderDetails.shippingInfo.zipCode}</p>
            <p>Phone: {orderDetails.shippingInfo.phoneNumber}</p>
          </div>
        </div>
        
        <div className="payment-methods">
          <h2>Payment Method</h2>
          
          <div className="payment-options">
            <div className="payment-option">
              <input 
                type="radio" 
                id="creditCard" 
                name="paymentMethod" 
                value="creditCard" 
                checked={paymentMethod === 'creditCard'} 
                onChange={handlePaymentMethodChange} 
              />
              <label htmlFor="creditCard">Credit Card</label>
            </div>
            
            <div className="payment-option">
              <input 
                type="radio" 
                id="paypal" 
                name="paymentMethod" 
                value="paypal" 
                checked={paymentMethod === 'paypal'} 
                onChange={handlePaymentMethodChange} 
              />
              <label htmlFor="paypal">PayPal</label>
            </div>
            
            <div className="payment-option">
              <input 
                type="radio" 
                id="cashOnDelivery" 
                name="paymentMethod" 
                value="cashOnDelivery" 
                checked={paymentMethod === 'cashOnDelivery'} 
                onChange={handlePaymentMethodChange} 
              />
              <label htmlFor="cashOnDelivery">Cash on Delivery</label>
            </div>
          </div>
          
          {paymentMethod === 'creditCard' && (
            <form className="credit-card-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input 
                  type="text" 
                  id="cardNumber" 
                  name="cardNumber" 
                  value={cardDetails.cardNumber} 
                  onChange={handleCardNumberChange} 
                  placeholder="1234 5678 9012 3456" 
                  maxLength="19" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardName">Cardholder Name</label>
                <input 
                  type="text" 
                  id="cardName" 
                  name="cardName" 
                  value={cardDetails.cardName} 
                  onChange={handleCardInputChange} 
                  placeholder="John Doe" 
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
                    value={cardDetails.expiryDate} 
                    onChange={handleCardInputChange} 
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
                    value={cardDetails.cvv} 
                    onChange={handleCardInputChange} 
                    placeholder="123" 
                    maxLength="3" 
                    required 
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="pay-now-btn" 
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          )}
          
          {paymentMethod === 'paypal' && (
            <div className="paypal-container">
              <p>You will be redirected to PayPal to complete your payment.</p>
              <button 
                className="paypal-btn" 
                onClick={handleSubmit} 
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Pay with PayPal'}
              </button>
            </div>
          )}
          
          {paymentMethod === 'cashOnDelivery' && (
            <div className="cod-container">
              <p>You will pay in cash when your order is delivered.</p>
              <button 
                className="cod-btn" 
                onClick={handleSubmit} 
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment; 