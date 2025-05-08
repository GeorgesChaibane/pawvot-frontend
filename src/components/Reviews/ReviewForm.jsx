import React, { useState } from 'react';
import './Reviews.css';

const ReviewForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [hoveredStar, setHoveredStar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = {};
    
    if (!formData.title.trim()) {
      validationErrors.title = 'Please enter a review title';
    }
    
    if (!formData.comment.trim()) {
      validationErrors.comment = 'Please enter your review';
    } else if (formData.comment.trim().length < 10) {
      validationErrors.comment = 'Your review must be at least 10 characters';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Submit the review
    onSubmit(formData);
  };

  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>
      
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rating">Rating*</label>
          <div className="star-input">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`star ${star <= (hoveredStar || formData.rating) ? 'active' : ''}`}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Review Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Summarize your review"
            maxLength="100"
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="comment">Review*</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="What did you like or dislike about this product?"
            rows="5"
            maxLength="1000"
          />
          {errors.comment && <div className="error-message">{errors.comment}</div>}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-review-btn">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm; 