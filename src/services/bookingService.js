import API from './api';

// Booking service for managing pet meet & greet bookings
const BookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise} Promise with created booking
   */
  createBooking: async (bookingData) => {
    try {
      const response = await API.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Get all bookings for current user
   * @returns {Promise} Promise with user bookings
   */
  getUserBookings: async () => {
    try {
      const response = await API.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  /**
   * Get booking by ID
   * @param {String} bookingId - Booking ID
   * @returns {Promise} Promise with booking data
   */
  getBookingById: async (bookingId) => {
    try {
      const response = await API.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  /**
   * Update booking details
   * @param {String} bookingId - Booking ID
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise} Promise with updated booking
   */
  updateBooking: async (bookingId, bookingData) => {
    try {
      const response = await API.put(`/bookings/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   * @param {String} bookingId - Booking ID
   * @returns {Promise} Promise with canceled booking
   */
  cancelBooking: async (bookingId) => {
    try {
      const response = await API.put(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  },

  /**
   * Get available booking times for a pet on a specific date
   * @param {String} petId - Pet ID
   * @param {String} date - Date in YYYY-MM-DD format
   * @returns {Promise} Promise with available time slots
   */
  getAvailableTimeSlots: async (petId, date) => {
    try {
      const response = await API.get(`/bookings/available/${petId}`, {
        params: { date }
      });
      return response.data.availableTimeSlots;
    } catch (error) {
      console.error('Error fetching available times:', error);
      throw error;
    }
  }
};

export default BookingService; 