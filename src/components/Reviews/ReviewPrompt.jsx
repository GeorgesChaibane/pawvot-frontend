import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewPrompt.css';

const ReviewPrompt = ({ product, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Add body class to prevent scrolling when prompt is open
    document.body.classList.add('review-prompt-open');
    
    return () => {
      document.body.classList.remove('review-prompt-open');
    };
  }, []);

  const handleReviewNow = () => {
    // Store don't show again preference if checked
    if (dontShowAgain) {
      localStorage.setItem('dontShowReviewPrompts', 'true');
    }
    
    // Navigate to product page with review section open
    navigate(`/products/${product._id}`, { state: { openReviewForm: true } });
    handleClose();
  };

  const handleClose = () => {
    // Store don't show again preference if checked
    if (dontShowAgain) {
      localStorage.setItem('dontShowReviewPrompts', 'true');
    }
    
    // Animate closing
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match the CSS transition duration
  };

  return (
    <div className={`review-prompt-overlay ${isClosing ? 'closing' : ''}`}>
      <div className={`review-prompt-container ${isClosing ? 'closing' : ''}`}>
        <button className="close-prompt-btn" onClick={handleClose}>×</button>
        
        <div className="prompt-product-info">
          <div className="prompt-product-image">
            <img 
              src={product.image || 'https://via.placeholder.com/100'} 
              alt={product.name} 
            />
          </div>
          <div className="prompt-product-details">
            <h3>How was your experience with this product?</h3>
            <p className="prompt-product-name">{product.name}</p>
          </div>
        </div>
        
        <div className="prompt-message">
          <p>Your review helps other customers make better decisions. Would you like to share your experience?</p>
        </div>
        
        <div className="prompt-actions">
          <div className="dont-show-again">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={() => setDontShowAgain(!dontShowAgain)}
            />
            <label htmlFor="dontShowAgain">Don't ask me again</label>
          </div>
          
          <div className="prompt-buttons">
            <button className="cancel-prompt-btn" onClick={handleClose}>
              Maybe Later
            </button>
            <button className="review-now-btn" onClick={handleReviewNow}>
              Review Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPrompt; 