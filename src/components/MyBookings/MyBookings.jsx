import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookingService from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const { isAuthenticated, /*currentUser*/ } = useAuth();

  useEffect(() => {
    // Fetch user's bookings
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const bookingsData = await BookingService.getUserBookings();
        setBookings(bookingsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  // Filter bookings based on status and date
  const filterBookings = () => {
    if (!bookings.length) return [];
    
    const now = new Date();
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      
      if (activeTab === 'upcoming') {
        return bookingDate >= now && booking.status !== 'cancelled';
      } else if (activeTab === 'past') {
        return bookingDate < now || booking.status === 'completed';
      } else if (activeTab === 'cancelled') {
        return booking.status === 'cancelled';
      }
      
      return true; // 'all' tab
    });
  };

  const filteredBookings = filterBookings();

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Cancel a booking
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setLoading(true);
        await BookingService.cancelBooking(bookingId);
        
        // Update booking in state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: 'cancelled' } 
              : booking
          )
        );
        
        setError(null);
      } catch (err) {
        console.error('Error cancelling booking:', err);
        setError('Failed to cancel booking. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="not-authenticated">
        <h2>Please log in to view your bookings</h2>
        <Link to="/login" className="login-btn">Log In</Link>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <h1>My Meet &amp; Greet Appointments</h1>
        <p>Manage your scheduled visits with our adorable pets</p>
      </div>
      
      <div className="bookings-container">
        {loading && bookings.length === 0 ? (
          <div className="loading-spinner-booking">
            <div className="spinner-booking"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="booking-tabs">
              <button 
                className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </button>
              <button 
                className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveTab('past')}
              >
                Past
              </button>
              <button 
                className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
                onClick={() => setActiveTab('cancelled')}
              >
                Cancelled
              </button>
              <button 
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
            </div>
            
            {filteredBookings.length === 0 ? (
              <div className="no-bookings">
                <h3>No {activeTab} bookings found</h3>
                {activeTab === 'upcoming' && (
                  <Link to="/pets" className="browse-pets-btn">
                    Browse Pets to Schedule a Visit
                  </Link>
                )}
              </div>
            ) : (
              <div className="bookings-list">
                {filteredBookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-pet-image">
                      <img 
                        src={booking.pet?.image || 'https://via.placeholder.com/150'} 
                        alt={booking.pet?.name || 'Pet'} 
                      />
                    </div>
                    
                    <div className="booking-details">
                      <div className="booking-pet-info">
                        <h3>{booking.pet?.name || 'Unknown Pet'}</h3>
                        <p>{booking.pet?.breed} • {booking.pet?.type}</p>
                      </div>
                      
                      <div className="booking-date-info">
                        <p className="booking-date">{formatDate(booking.bookingDate)}</p>
                        <span className={`booking-status status-${booking.status}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="booking-contact">
                        <p><strong>Contact Name:</strong> {booking.name}</p>
                        <p><strong>Email:</strong> {booking.email}</p>
                        <p><strong>Phone:</strong> {booking.phone}</p>
                        {booking.message && (
                          <p><strong>Message:</strong> {booking.message}</p>
                        )}
                      </div>
                      
                      {booking.status === 'pending' && new Date(booking.bookingDate) > new Date() && (
                        <div className="booking-actions">
                          <Link 
                            to={`/bookings/edit/${booking._id}`} 
                            className="edit-booking-btn"
                          >
                            Reschedule
                          </Link>
                          <button 
                            className="cancel-booking-btn"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
