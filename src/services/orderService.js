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
  }
};

export default OrderService; 