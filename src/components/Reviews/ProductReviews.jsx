import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ReviewService from '../../services/reviewService';
import ReviewForm from './ReviewForm';
import './Reviews.css';

const ProductReviews = ({ productId }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    average: 0,
    total: 0,
    distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eligibility, setEligibility] = useState({
    canReview: false,
    hasReviewed: false,
    hasPurchased: false
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await ReviewService.getProductReviews(productId);
        setReviews(reviewsData);
        
        // Calculate review statistics
        if (reviewsData.length > 0) {
          const total = reviewsData.length;
          const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
          const average = sum / total;
          
          // Calculate distribution
          const distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
          reviewsData.forEach(review => {
            distribution[review.rating] = (distribution[review.rating] || 0) + 1;
          });
          
          setReviewStats({
            average,
            total,
            distribution
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    const checkUserEligibility = async () => {
      if (!isAuthenticated || !productId) return;
      
      try {
        const eligibilityData = await ReviewService.checkReviewEligibility(productId);
        setEligibility(eligibilityData);
      } catch (err) {
        console.error('Error checking review eligibility:', err);
      }
    };
    
    fetchReviews();
    checkUserEligibility();
  }, [productId, isAuthenticated, reviewSubmitted]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      await ReviewService.createReview(productId, reviewData);
      setReviewSubmitted(true);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Generate star rating display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">★</span>
        ))}
        {halfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">☆</span>
        ))}
      </div>
    );
  };

  return (
    <div className="product-reviews">
      <h2>Customer Reviews</h2>
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="review-error">{error}</div>
      ) : (
        <>
          <div className="review-summary">
            <div className="average-rating">
              <div className="rating-value">{reviewStats.average.toFixed(1)}</div>
              <div className="rating-stars">{renderStars(reviewStats.average)}</div>
              <div className="rating-count">{reviewStats.total} {reviewStats.total === 1 ? 'review' : 'reviews'}</div>
            </div>
            
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviewStats.distribution[rating] || 0;
                const percentage = reviewStats.total ? Math.round((count / reviewStats.total) * 100) : 0;
                
                return (
                  <div key={rating} className="rating-bar">
                    <div className="rating-label">{rating} stars</div>
                    <div className="rating-progress">
                      <div 
                        className="rating-progress-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="rating-count-small">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="review-actions">
              {eligibility.canReview && (
                <button 
                  className="write-review-btn" 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              )}
              
              {eligibility.hasReviewed && (
                <div className="already-reviewed-message">
                  You've already reviewed this product
                </div>
              )}
              
              {!eligibility.hasPurchased && !eligibility.hasReviewed && (
                <div className="purchase-required-message">
                  You need to purchase this product to leave a review
                </div>
              )}
            </div>
          )}
          
          {showReviewForm && (
            <ReviewForm onSubmit={handleReviewSubmit} />
          )}
          
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <p>This product has no reviews yet. Be the first to leave one!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <div className="review-title">{review.title}</div>
                  </div>
                  
                  <div className="review-meta">
                    <span className="review-author">
                      By {review.user.firstName} {review.user.lastName}
                    </span>
                    <span className="review-date">
                      on {formatDate(review.createdAt)}
                    </span>
                    {review.verifiedPurchase && (
                      <span className="verified-purchase-badge">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  <div className="review-content">
                    {review.comment}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductReviews; 