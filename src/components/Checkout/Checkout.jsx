import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(10);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  useEffect(() => {
    // Fetch cart items from local storage or state management
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
    
    // Calculate subtotal
    const total = storedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process checkout information
    const orderDetails = {
      items: cartItems,
      subtotal,
      shipping: shippingCost,
      total: subtotal + shippingCost,
      shippingInfo,
      paymentMethod
    };
    
    // Save order details to local storage or send to backend
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    
    // Navigate to payment page
    navigate('/payment');
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="price-summary">
            <div className="price-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>${(subtotal + shippingCost).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="shipping-info">
            <h2>Shipping Information</h2>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                value={shippingInfo.fullName} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                value={shippingInfo.address} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={shippingInfo.city} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input 
                  type="text" 
                  id="state" 
                  name="state" 
                  value={shippingInfo.state} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input 
                  type="text" 
                  id="zipCode" 
                  name="zipCode" 
                  value={shippingInfo.zipCode} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input 
                type="tel" 
                id="phoneNumber" 
                name="phoneNumber" 
                value={shippingInfo.phoneNumber} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>
          
          <div className="payment-method">
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
          </div>
          
          <button type="submit" className="proceed-btn">Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 