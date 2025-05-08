import React, { useState } from 'react';
import { useNavigate/*, useLocation */} from 'react-router-dom';
import './PaymentInfoPage.css';

const PaymentInfoPage = ({ onNext, shippingData, setPaymentMethod }) => {
  const navigate = useNavigate();
  //const location = useLocation();
  //const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(null);
  const [paymentMethod, setSelectedPaymentMethod] = useState('credit-card');
  
  // Get order total from state passed during navigation
  //const orderTotal = location.state?.orderTotal || 0;
  
  // const [formData, setFormData] = useState({
  //   cardNumber: '',
  //   cardHolder: '',
  //   expiryDate: '',
  //   cvv: '',
  //   saveCard: false
  // });

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
    
  //   // Format card number with spaces
  //   if (name === 'cardNumber') {
  //     const formattedValue = value
  //       .replace(/\s/g, '')
  //       .replace(/(.{4})/g, '$1 ')
  //       .trim()
  //       .substring(0, 19);
      
  //     setFormData({
  //       ...formData,
  //       [name]: formattedValue
  //     });
  //     return;
  //   }
    
  //   // Format expiry date as MM/YY
  //   if (name === 'expiryDate') {
  //     const cleaned = value.replace(/\D/g, '').substring(0, 4);
  //     let formatted = cleaned;
      
  //     if (cleaned.length > 2) {
  //       formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
  //     }
      
  //     setFormData({
  //       ...formData,
  //       [name]: formatted
  //     });
  //     return;
  //   }
    
  //   // Regular inputs
  //   setFormData({
  //     ...formData,
  //     [name]: type === 'checkbox' ? checked : value
  //   });
  // };

  // const validateForm = () => {
  //   // Simple validation
  //   if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
  //     setError('Please enter a valid card number');
  //     return false;
  //   }
    
  //   if (!formData.cardHolder) {
  //     setError('Please enter the cardholder name');
  //     return false;
  //   }
    
  //   if (!formData.expiryDate || formData.expiryDate.length < 5) {
  //     setError('Please enter a valid expiry date (MM/YY)');
  //     return false;
  //   }
    
  //   if (!formData.cvv || formData.cvv.length < 3) {
  //     setError('Please enter a valid CVV code');
  //     return false;
  //   }
    
  //   return true;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentMethod(paymentMethod);
    onNext();
  };

  return (
    <div className="payment-info-page">
      <h2>Payment Method</h2>
      <p className="payment-subtitle">Select your preferred payment method</p>

      <form onSubmit={handleSubmit} className="payment-method-form">
        <div className="payment-method-options">
          <label className="payment-method-option">
            <div className="payment-method-radio">
              <input
                type="radio"
                name="paymentMethod"
                value="credit-card"
                checked={paymentMethod === 'credit-card'}
                onChange={() => setSelectedPaymentMethod('credit-card')}
              />
              <span className="radio-custom"></span>
            </div>
            <div className="payment-method-content">
              <div className="payment-method-icon credit-card-icon">💳</div>
              <div className="payment-method-details">
                <h3>Credit Card</h3>
                <p>Pay securely with your credit card</p>
              </div>
            </div>
          </label>

          <label className="payment-method-option">
            <div className="payment-method-radio">
              <input
                type="radio"
                name="paymentMethod"
                value="cash-on-delivery"
                checked={paymentMethod === 'cash-on-delivery'}
                onChange={() => setSelectedPaymentMethod('cash-on-delivery')}
              />
              <span className="radio-custom"></span>
            </div>
            <div className="payment-method-content">
              <div className="payment-method-icon cash-icon">💵</div>
              <div className="payment-method-details">
                <h3>Cash On Delivery</h3>
                <p>Pay when you receive your package</p>
              </div>
            </div>
          </label>
        </div>

        <div className="payment-buttons">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/checkout/shipping')}
          >
            Back to Shipping
          </button>
          <button type="submit" className="continue-button">
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentInfoPage; 