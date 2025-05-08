import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PetService from '../../services/petService';
import BookingService from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import './BookingPage.css';

const BookingPage = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      // Save the return URL
      localStorage.setItem('returnUrl', `/pets/${petId}/book`);
      navigate('/login');
      return;
    }

    // Update form with user data when available
    if (currentUser) {
      setFormData(prevState => ({
        ...prevState,
        name: currentUser.firstName && currentUser.lastName ? 
          `${currentUser.firstName} ${currentUser.lastName}` : '',
        email: currentUser.email || ''
      }));
    }

    // Fetch pet from API
    const fetchPet = async () => {
      try {
        setLoading(true);
        const petData = await PetService.getPetById(petId);
        
        if (petData) {
          // Process the pet data
          const processedPet = {
            ...petData,
            image: petData.image ? 
              (petData.image.startsWith('http') ? petData.image : 
               petData.image.startsWith('/') ? `http://localhost:5000${petData.image}` : 
               petData.image) : 
              'https://via.placeholder.com/300x300?text=No+Image'
          };
          
          setPet(processedPet);
        } else {
          setError('Pet not found');
        }
      } catch (err) {
        console.error('Error fetching pet:', err);
        setError(err.message || 'Failed to fetch pet details');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId, navigate, isAuthenticated, currentUser]);

  // When date changes, fetch available time slots
  useEffect(() => {
    if (formData.date && pet) {
      const fetchTimeSlots = async () => {
        try {
          const slots = await BookingService.getAvailableTimeSlots(petId, formData.date);
          setAvailableTimeSlots(slots);
        } catch (err) {
          console.error('Error fetching time slots:', err);
          setAvailableTimeSlots([]);
        }
      };
      
      fetchTimeSlots();
    } else {
      setAvailableTimeSlots([]);
    }
  }, [formData.date, petId, pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare date and time
      const dateTime = new Date(formData.date);
      const [hours, minutes] = formData.time.split(':').map(Number);
      const isPM = formData.time.includes('PM');
      
      // Set hours (convert from 12-hour to 24-hour format if PM)
      dateTime.setHours(
        isPM && hours !== 12 ? hours + 12 : (hours === 12 && !isPM ? 0 : hours)
      );
      dateTime.setMinutes(minutes || 0);
      
      // Create booking data
      const bookingData = {
        petId,
        bookingDate: dateTime.toISOString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      };
      
      // Submit booking
      await BookingService.createBooking(bookingData);
      
      // Show success state
      setBookingSuccess(true);
    } catch (err) {
      console.error('Error creating booking:', err);
      
      // Handle specific error types
      if (err.response && err.response.status === 409) {
        setError('This time slot is no longer available. Please select a different time.');
      } else {
        setError('Failed to book appointment. Please try again.');
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

  if (loading && !pet) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>Loading pet information...</p>
      </div>
    );
  }

  if (error && !pet) {
    return (
      <div className="pet-not-found">
        <h2>Pet Not Found</h2>
        <p>{error || "We couldn't find the pet you're looking for."}</p>
        <Link to="/pets" className="back-to-pets-btn">Browse All Pets</Link>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="booking-success">
        <div className="success-icon">✓</div>
        <h2>Booking Confirmed!</h2>
        <p>Your appointment request has been submitted! Please check your email to confirm your booking.</p>
        <div className="booking-actions">
          <Link to={`/pets/${petId}`} className="back-to-pet-btn">Back to {pet.name}'s Profile</Link>
          <Link to="/pets" className="browse-pets-btn">Browse More Pets</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <Link to={`/pets/${petId}`} className="back-link">&#8592; Back to Pet Profile</Link>
          <h1>Schedule a Meet & Greet</h1>
          <p>Book a time to meet {pet.name} at {pet.location || 'our center'}</p>
        </div>

        <div className="booking-content">
          <div className="pet-summary">
            <div className="pet-image">
              <img src={pet.image} alt={pet.name} />
            </div>
            <div className="pet-info">
              <h2>{pet.name}</h2>
              <p>{pet.breed} • {pet.type}</p>
              <p className="pet-location">{pet.location || 'Pet Adoption Center'}</p>
            </div>
          </div>

          {error && (
            <div className="booking-error">
              <p>{error}</p>
            </div>
          )}

          <form className="booking-form" onSubmit={handleSubmit}>
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

            <button 
              type="submit" 
              className="submit-booking-btn"
              disabled={loading || !formData.date || !formData.time}
            >
              {loading ? "Submitting..." : "Confirm Booking"}
            </button>
          </form>

          <div className="booking-info">
            <h3>What to Expect</h3>
            <p>During your meet and greet, you'll have the opportunity to interact with {pet.name} and speak with our adoption counselors who can answer any questions you may have about {pet.name}'s personality, health, and care requirements.</p>
            <p>Please arrive 10 minutes before your scheduled appointment. If you need to reschedule, please do so at least 24 hours in advance.</p>
          </div>
        </div>
      </div>
      <div className="page-footer-spacer"></div>
    </div>
  );
};

export default BookingPage; 