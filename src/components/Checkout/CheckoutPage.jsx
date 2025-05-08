import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CartService from '../../services/cartService';
import OrderService from '../../services/orderService';
import AuthService from '../../services/authService';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'credit-card',
    saveInfo: true
  });
  
  useEffect(() => {
    // Get cart items
    const cartItems = CartService.getCartItems();
    setCart(cartItems);
    
    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => 
      total + item.price * item.quantity, 0
    );
    
    // Calculate shipping (free if over $50)
    const shipping = subtotal >= 50 ? 0 : 5.99;
    
    // Calculate tax (11%)
    const taxAmount = subtotal * 0.11;
    
    setCartTotal(subtotal);
    setShippingCost(shipping);
    setTax(taxAmount);
    setOrderTotal(subtotal + shipping + taxAmount);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create order object
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shipping: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone
        },
        payment: {
          method: formData.paymentMethod
        },
        // Add shipping, tax and total values to be saved with the order
        subtotal: cartTotal,
        shippingCost: shippingCost,
        tax: tax,
        totalPrice: orderTotal
      };
      
      // Submit order
      const order = await OrderService.createOrder(orderData);
      
      // Clear cart after successful order
      await CartService.clearCart();
      
      // If cash on delivery, skip payment page
      if (formData.paymentMethod === 'cash-on-delivery') {
        // Mark order as completed with cash on delivery
        await OrderService.updatePayment(order._id, {
          paymentMethod: "cash-on-delivery"
        });
        
        // Try to send order confirmation email
        try {
          const user = await AuthService.getCurrentUser();
          if (user && user.email) {
            await fetch('/api/email/order-confirmation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                order: order
              })
            });
          }
        } catch (error) {
          console.error('Error sending order confirmation email:', error);
          // Continue even if email fails
        }
        
        // Navigate to cash success page
        navigate(`/cash-success/${order._id}`);
      } else {
        // Redirect to payment page with order ID
        navigate(`/payment/${order._id}`);
      }
      
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      
      <div className="checkout-container">
        {error && (
          <div className="checkout-error-message">
            {error}
          </div>
        )}
        
        <div className="checkout-form-section">
          <h2 className="checkout-form-title">Shipping Information</h2>
          
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="checkout-form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="checkout-form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="checkout-form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="checkout-form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="checkout-form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="checkout-form-group">
              <label>Payment Method</label>
              
              <div className="checkout-payment-methods">
                <div className={`checkout-payment-method ${formData.paymentMethod === 'credit-card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    id="credit-card"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="credit-card" className="checkout-payment-method-name">Credit Card</label>
                </div>
                
                <div className={`checkout-payment-method ${formData.paymentMethod === 'cash-on-delivery' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    id="cash-on-delivery"
                    name="paymentMethod"
                    value="cash-on-delivery"
                    checked={formData.paymentMethod === 'cash-on-delivery'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="cash-on-delivery" className="checkout-payment-method-name">Cash on Delivery</label>
                </div>
              </div>
            </div>
            
            {/* <div className="checkout-save-info">
              <input
                type="checkbox"
                id="saveInfo"
                name="saveInfo"
                checked={formData.saveInfo}
                onChange={handleInputChange}
              />
              <label htmlFor="saveInfo">Save this information for next time</label>
            </div> */}
            
            <button 
              type="button" 
              className="checkout-button"
              onClick={() => navigate('/cart')}
              style={{ backgroundColor: '#6c757d' }}
            >
              Back to Cart
            </button>
            
            <button 
              type="submit" 
              className="checkout-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
        
        <div className="checkout-summary-section">
          <h2 className="checkout-summary-title">Order Summary</h2>
          
          <div className="checkout-cart-items">
            {cart.map(item => (
              <div key={item.productId} className="checkout-cart-item">
                <div className="checkout-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="checkout-item-details">
                  <h4 className="checkout-item-name">{item.name}</h4>
                  <p className="checkout-item-price">${item.price.toFixed(2)} × {item.quantity}</p>
                  <p className="checkout-item-quantity">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="checkout-total-row">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            
            <div className="checkout-total-row">
              <span>Tax (11%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div className="checkout-total-row grand-total">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 