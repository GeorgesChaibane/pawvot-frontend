import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
//import { useAuth } from '../../context/AuthContext';
import OrderService from '../../services/orderService';
import config from '../../config';
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated/*, setIsAuthenticated*/] = useState(true);
  const [userReviews, setUserReviews] = useState([]);
  const [activeReview, setActiveReview] = useState(null);
  const [editingReview, setEditingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!isAuthenticated) {
          return;
        }
        
        if (!orderId) {
          setError('Order ID is missing');
          setLoading(false);
          return;
        }
        
        const orderData = await OrderService.getOrderById(orderId);
        
        if (!orderData || typeof orderData !== 'object') {
          throw new Error('Invalid order data received');
        }
        
        setOrder(orderData);
        setError(null);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, isAuthenticated]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        if (!isAuthenticated) {
          return;
        }
        
        const reviews = await OrderService.getUserReviews(orderId);
        setUserReviews(reviews);
      } catch (err) {
        console.error('Error fetching user reviews:', err);
        setError('Failed to load user reviews. Please try again.');
      }
    };
    
    fetchUserReviews();
  }, [orderId, isAuthenticated]);

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
      
      // Update the order state to reflect the cancelled status
      setOrder(prevOrder => ({
        ...prevOrder,
        status: 'Cancelled'
      }));
      
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order. Please try again.');
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class based on order status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'status-badge processing';
      case 'Shipped':
        return 'status-badge shipped';
      case 'Delivered':
        return 'status-badge delivered';
      case 'Cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  };

  const handleEditReview = (review) => {
    setActiveReview(review);
    setEditingReview(true);
    setReviewForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to remove this review?')) {
      return;
    }
    
    try {
      await OrderService.deleteReview(reviewId);
      setUserReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
      setActiveReview(null);
      setEditingReview(false);
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    }
  };

  const handleRatingChange = (rating) => {
    setReviewForm(prevForm => ({
      ...prevForm,
      rating: rating
    }));
  };

  const handleReviewFormChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!activeReview) {
      setReviewError('No review selected');
      return;
    }
    
    try {
      const updatedReview = await OrderService.updateReview(activeReview._id, reviewForm);
      setUserReviews(prevReviews => prevReviews.map(review =>
        review._id === activeReview._id ? updatedReview : review
      ));
      setActiveReview(null);
      setEditingReview(false);
      setReviewForm({
        rating: 0,
        title: '',
        comment: ''
      });
    } catch (err) {
      console.error('Error updating review:', err);
      setReviewError('Failed to update review. Please try again.');
    }
  };

  const handleCancelReview = () => {
    setActiveReview(null);
    setEditingReview(false);
    setReviewForm({
      rating: 0,
      title: '',
      comment: ''
    });
  };

  if (loading) {
    return (
      <div className="order-detail-container loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-container error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container error">
        <h2>Order Not Found</h2>
        <p>We couldn't find the order you're looking for.</p>
        <Link to="/account/orders" className="back-button">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <div className="order-title">
          <h2>Order #{order._id}</h2>
          <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className={getStatusBadgeClass(order.status)}>
          {order.status}
        </div>
      </div>

      <div className="order-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${order.progressPercentage}%` }}></div>
        </div>
        <div className="progress-steps">
          <div className={`progress-step ${order.status !== 'Cancelled' ? 'active' : ''}`}>Processing</div>
          <div className={`progress-step ${order.status === 'Shipped' || order.status === 'Delivered' ? 'active' : ''}`}>Shipped</div>
          <div className={`progress-step ${order.status === 'Delivered' ? 'active' : ''}`}>Delivered</div>
        </div>
      </div>

      {order.trackingNumber && (
        <div className="tracking-info">
          <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
          <button className="track-button">Track Package</button>
        </div>
      )}

      <div className="order-detail-grid">
        <div className="order-items">
          <h3>Items Ordered</h3>
          <div className="items-list">
            {order.items?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-image">
                  <img src={item.product?.images?.[0] ? config.getImageUrl(item.product.images[0]) : 
                      item.image ? config.getImageUrl(item.image) : 
                      'https://via.placeholder.com/80'} 
                    alt={item.product?.name || item.name || 'Product'} />
                </div>
                <div className="item-info">
                  <h4>{item.product?.name || item.name || 'Product'}</h4>
                  <p className="item-price">${parseFloat(item.price).toFixed(2)}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary-section">
          <h3>Order Summary</h3>
          <div className="order-summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${parseFloat(order.itemsPrice || order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${parseFloat(order.shippingPrice || order.shippingCost || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${parseFloat(order.taxPrice || order.tax || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${parseFloat(order.totalPrice || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="order-info-grid">
        <div className="shipping-info">
          <h3>Shipping Information</h3>
          {order.shippingAddress ? (
            <>
              <p><strong>Name:</strong> {order.shippingAddress.fullName || `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`}</p>
              <p><strong>Address:</strong> {order.shippingAddress.address}</p>
              <p><strong>City:</strong> {order.shippingAddress.city}</p>
              <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode || order.shippingAddress.zipCode}</p>
              <p><strong>Country:</strong> {order.shippingAddress.country || order.shippingAddress.state}</p>
              <p><strong>Phone:</strong> {order.shippingAddress.phoneNumber || order.shippingAddress.phone}</p>
            </>
          ) : (
            <p>No shipping information available</p>
          )}
        </div>

        <div className="payment-info">
          <h3>Payment Information</h3>
          <p><strong>Method:</strong> {order.paymentMethod}</p>
          <p><strong>Status:</strong> {order.isPaid ? 'Paid' : 'Pending'}</p>
          {order.isPaid && <p><strong>Paid On:</strong> {formatDate(order.paidAt)}</p>}
          {order.paymentResult && (
            <>
              <p><strong>Transaction ID:</strong> {order.paymentResult.id}</p>
              <p><strong>Payment Status:</strong> {order.paymentResult.status}</p>
            </>
          )}
        </div>
      </div>

      <div className="order-actions">
        <button onClick={() => navigate(-1)} className="back-button">
          Return to Orders
        </button>
        
        {order.status === 'Processing' && !order.isDelivered && (
          <button 
            className="cancel-order-button"
            onClick={handleCancelOrder}
          >
            Cancel Order
          </button>
        )}
      </div>

      {order.status === 'Delivered' && (
        <div className="review-section">
          <h3>Product Reviews</h3>
          {/* Display existing reviews */}
          {userReviews.length > 0 ? (
            <div className="existing-reviews">
              {userReviews.map(review => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <h4>{review.title}</h4>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? "star filled" : "star"}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <div className="review-actions">
                    <button 
                      onClick={() => handleEditReview(review)} 
                      className="edit-review-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to remove this review?")) {
                          handleDeleteReview(review._id);
                        }
                      }} 
                      className="delete-review-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Only show "No reviews yet" message, but don't show the "Write Product Reviews" button */
            <p>You haven't reviewed any products from this order yet.</p>
          )}
          
          {/* Review form - Only show when user clicks Edit */}
          {activeReview && (
            <div className="review-form">
              <h4>{editingReview ? 'Edit Review' : 'Write a Review'}</h4>
              {reviewError && <p className="error-message">{reviewError}</p>}
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < reviewForm.rating ? "star filled" : "star"}
                      onClick={() => handleRatingChange(i + 1)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={reviewForm.title}
                  onChange={handleReviewFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  value={reviewForm.comment}
                  onChange={handleReviewFormChange}
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCancelReview} className="cancel-button">
                  Cancel
                </button>
                <button type="button" onClick={handleSubmitReview} className="submit-button">
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetail; 