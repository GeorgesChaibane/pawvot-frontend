import API from './api';

// Order service for managing orders
const OrderService = {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise} Promise with created order
   */
  createOrder: async (orderData) => {
    try {
      // Format the order data for the API
      const formattedOrderData = {
        items: orderData.items.map(item => ({
          product: item.productId || item.product,
          quantity: item.quantity
        })),
        shippingAddress: {
          firstName: orderData.shipping.firstName,
          lastName: orderData.shipping.lastName,
          address: orderData.shipping.address,
          city: orderData.shipping.city,
          state: orderData.shipping.state,
          postalCode: orderData.shipping.zipCode,
          phoneNumber: orderData.shipping.phone,
          country: 'Lebanon' // Default country
        },
        paymentMethod: orderData.payment.method
      };
      
      // Send the request
      const response = await API.post('/orders', formattedOrderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Get order by ID
   * @param {String} orderId - Order ID
   * @returns {Promise} Promise with order data
   */
  getOrderById: async (orderId) => {
    try {
      const response = await API.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  /**
   * Get orders for current user
   * @returns {Promise} Promise with user orders
   */
  getUserOrders: async () => {
    try {
      const response = await API.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  /**
   * Update order payment status
   * @param {String} orderId - Order ID
   * @param {Object} paymentData - Payment data
   * @returns {Promise} Promise with updated order
   */
  updatePayment: async (orderId, paymentData) => {
    try {
      // Special case for cash on delivery
      if (paymentData.paymentMethod === 'cash-on-delivery') {
        const response = await API.put(`/orders/${orderId}/pay`, {
          paymentMethod: 'cash-on-delivery'
        });
        return response.data;
      }
      
      // Regular credit card payment
      const response = await API.put(`/orders/${orderId}/pay`, {
        paymentResult: paymentData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  },

  /**
   * Cancel an order
   * @param {String} orderId - Order ID
   * @returns {Promise} Promise with canceled order
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await API.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  },

  /**
   * Get user reviews for an order
   * @param {string} orderId - Order ID
   * @returns {Promise<Array>} - Array of user reviews
   */
  getUserReviews: async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await API.get(`/reviews/user`, config);
      
      // Filter reviews for products in this specific order if orderId is provided
      if (orderId) {
        // We would need to get the order details first to know which products to filter by
        const orderResponse = await API.get(`/orders/${orderId}`, config);
        const productIds = orderResponse.data.items.map(item => item.product._id);
        
        return response.data.filter(review => 
          productIds.includes(review.product._id || review.product)
        );
      }
      
      return response.data;
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw error;
    }
  },

  /**
   * Update a review
   * @param {string} reviewId - Review ID
   * @param {Object} reviewData - Review data to update
   * @returns {Promise<Object>} - Updated review
   */
  updateReview: async (reviewId, reviewData) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await API.put(`/reviews/${reviewId}`, reviewData, config);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   * @returns {Promise<Object>} - Delete confirmation
   */
  deleteReview: async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await API.delete(`/reviews/${reviewId}`, config);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
};

export default OrderService; 