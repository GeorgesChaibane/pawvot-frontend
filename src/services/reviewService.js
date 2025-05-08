import API from './api';

// Review service for managing product reviews
const ReviewService = {
  /**
   * Create a new product review
   * @param {string} productId - Product ID
   * @param {object} reviewData - Review data (rating, title, comment)
   * @returns {Promise} Promise with created review
   */
  createReview: async (productId, reviewData) => {
    try {
      const response = await API.post(`/reviews/product/${productId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  /**
   * Get all reviews for a product
   * @param {string} productId - Product ID
   * @returns {Promise} Promise with product reviews
   */
  getProductReviews: async (productId) => {
    try {
      const response = await API.get(`/reviews/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  },

  /**
   * Get all reviews by the current user
   * @returns {Promise} Promise with user's reviews
   */
  getUserReviews: async () => {
    try {
      const response = await API.get('/reviews/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },

  /**
   * Update a review
   * @param {string} reviewId - Review ID
   * @param {object} reviewData - Updated review data
   * @returns {Promise} Promise with updated review
   */
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await API.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   * @returns {Promise} Promise with success message
   */
  deleteReview: async (reviewId) => {
    try {
      const response = await API.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  /**
   * Check if user can review a product
   * @param {string} productId - Product ID
   * @returns {Promise} Promise with review eligibility data
   */
  checkReviewEligibility: async (productId) => {
    try {
      const response = await API.get(`/reviews/check/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      throw error;
    }
  }
};

export default ReviewService; 