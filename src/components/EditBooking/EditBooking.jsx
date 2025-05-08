import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BookingService from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import './EditBooking.css';

const EditBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch booking details
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const bookingData = await BookingService.getBookingById(bookingId);
        
        if (bookingData) {
          setBooking(bookingData);
          
          // Convert booking date to local date format for form
          const bookingDate = new Date(bookingData.bookingDate);
          const formattedDate = bookingDate.toISOString().split('T')[0];
          
          // Format time for the form (12-hour format with AM/PM)
          const hours = bookingDate.getHours();
          const minutes = bookingDate.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12;
          const formattedMinutes = minutes.toString().padStart(2, '0');
          const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
          
          // Set form data
          setFormData({
            date: formattedDate,
            time: formattedTime,
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            message: bookingData.message || ''
          });
          
          // Fetch available time slots for the date
          if (formattedDate) {
            fetchTimeSlots(bookingData.pet._id, formattedDate);
          }
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate, isAuthenticated]);

  const fetchTimeSlots = async (petId, date) => {
    try {
      const slots = await BookingService.getAvailableTimeSlots(petId, date);
      
      // Add current time slot to available slots if it's on the same date
      const currentBookingDate = new Date(booking?.bookingDate);
      const selectedDate = new Date(date);
      
      if (booking && 
          selectedDate.getFullYear() === currentBookingDate.getFullYear() &&
          selectedDate.getMonth() === currentBookingDate.getMonth() &&
          selectedDate.getDate() === currentBookingDate.getDate()) {
        
        // Format current booking time
        const hours = currentBookingDate.getHours();
        const minutes = currentBookingDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const currentTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
        
        // Add to slots if not already included
        if (!slots.includes(currentTime)) {
          slots.push(currentTime);
          // Sort times in chronological order
          slots.sort((a, b) => {
            const parseTime = (timeStr) => {
              const [time, period] = timeStr.split(' ');
              let [hours, minutes] = time.split(':').map(Number);
              if (period === 'PM' && hours !== 12) hours += 12;
              if (period === 'AM' && hours === 12) hours = 0;
              return hours * 60 + minutes;
            };
            return parseTime(a) - parseTime(b);
          });
        }
      }
      
      setAvailableTimeSlots(slots);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setAvailableTimeSlots([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // When date changes, fetch available time slots
    if (name === 'date' && booking) {
      fetchTimeSlots(booking.pet._id, value);
      // Reset time when date changes
      setFormData(prev => ({
        ...prev,
        time: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare date and time
      const dateTime = new Date(formData.date);
      const [timeStr, period] = formData.time.split(' ');
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      // Set hours (convert from 12-hour to 24-hour format if PM)
      dateTime.setHours(
        period === 'PM' && hours !== 12 ? hours + 12 : (hours === 12 && period === 'AM' ? 0 : hours)
      );
      dateTime.setMinutes(minutes || 0);
      
      // Update booking data
      const bookingData = {
        bookingDate: dateTime.toISOString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      };
      
      // Submit booking update
      await BookingService.updateBooking(bookingId, bookingData);
      
      // Show success state
      setUpdateSuccess(true);
    } catch (err) {
      console.error('Error updating booking:', err);
      
      // Handle specific error types
      if (err.response && err.response.status === 409) {
        setError('This time slot is no longer available. Please select a different time.');
      } else {
        setError('Failed to update appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get min date (today) for date picker
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get max date (30 days from today) for date picker
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (loading && !booking) {
    return (
      <div className="edit-booking-loading">
        <div className="loading-spinner"></div>
        <p>Loading booking information...</p>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="booking-error-page">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/bookings" className="back-to-bookings-btn">Back to My Bookings</Link>
      </div>
    );
  }

  if (updateSuccess) {
    return (
      <div className="booking-update-success">
        <div className="success-icon">✓</div>
        <h2>Booking Updated!</h2>
        <p>Your appointment has been successfully rescheduled.</p>
        <div className="booking-actions">
          <Link to="/bookings" className="back-to-bookings-btn">Back to My Bookings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-booking-page">
      <div className="edit-booking-container">
        <div className="edit-booking-header">
          <Link to="/bookings" className="back-link">&#8592; Back to My Bookings</Link>
          <h1>Update Your Booking</h1>
          <p>Reschedule your meet &amp; greet with {booking?.pet?.name}</p>
        </div>

        {booking && (
          <div className="edit-booking-content">
            <div className="pet-summary">
              <div className="pet-image">
                <img 
                  src={booking.pet?.image || 'https://via.placeholder.com/150'} 
                  alt={booking.pet?.name || 'Pet'} 
                />
              </div>
              <div className="pet-info">
                <h2>{booking.pet?.name}</h2>
                <p>{booking.pet?.breed} • {booking.pet?.type}</p>
              </div>
            </div>

            {error && (
              <div className="edit-booking-error">
                <p>{error}</p>
              </div>
            )}

            <form className="edit-booking-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Select a Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Select a Time *</label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={!formData.date || availableTimeSlots.length === 0 || loading}
                  >
                    <option value="">Select a time</option>
                    {formData.date && availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))
                    ) : formData.date ? (
                      <option value="" disabled>No available times on this date</option>
                    ) : null}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any questions or special requests?"
                  rows="3"
                  disabled={loading}
                ></textarea>
              </div>

              <div className="form-actions">
                <Link 
                  to="/bookings" 
                  className="cancel-button"
                >
                  Cancel
                </Link>
                <button 
                  type="submit" 
                  className="update-booking-btn"
                  disabled={loading || !formData.date || !formData.time}
                >
                  {loading ? "Updating..." : "Update Booking"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditBooking; 