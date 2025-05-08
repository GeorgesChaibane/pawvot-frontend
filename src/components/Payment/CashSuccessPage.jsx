import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CashSuccessPage.css'; // We'll create this next

const CashSuccessPage = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();

    return (
        <div className="cash-success-page">
            <div className="success-container">
                <div className="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4BB543" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                
                <h1>Order Placed Successfully!</h1>
                <p className="order-id">Order ID: {orderId}</p>
                <p className="success-message">
                    Your order has been placed with Cash on Delivery payment method. 
                    We'll start preparing your items right away!
                </p>
                
                <div className="delivery-info">
                    <h3>What's Next?</h3>
                    <ol>
                        <li>Our team will prepare your order</li>
                        <li>You'll receive an email when your order ships</li>
                        <li>Our delivery partner will contact you before arrival</li>
                        <li>Pay in cash when you receive your items</li>
                    </ol>
                </div>
                
                <div className="action-buttons">
                    <button 
                        className="view-order-btn"
                        onClick={() => navigate(`/orders/${orderId}`)}
                    >
                        View Order Details
                    </button>
                    <button 
                        className="continue-shopping-btn-cash"
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CashSuccessPage; 