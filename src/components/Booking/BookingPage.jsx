import React, { useState, useEffect } from 'react';
import { useParams, Link, /*useNavigate*/ } from 'react-router-dom';
import './BookingPage.css';

// Import placeholder data (in a real app, this would come from an API)
const DUMMY_PETS = [
  {
    id: 'pet1',
    name: 'Max',
    type: 'Dog',
    breed: 'Golden Retriever',
    image: '/path/to/dog1-1.jpg',
    location: 'Pet Zone, Beirut',
  },
  {
    id: 'pet2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Persian',
    image: '/path/to/cat1-1.jpg',
    location: 'Pegasus Pets Shop, Jounieh',
  }
];

const BookingPage = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  //const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPet = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const foundPet = DUMMY_PETS.find(p => p.id === petId);
        setPet(foundPet || null);
        setLoading(false);
      }, 500);
    };

    fetchPet();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would make an API call to save the booking
    console.log('Booking submitted:', { pet: petId, ...formData });
    
    // Simulate successful booking
    setTimeout(() => {
      setBookingSuccess(true);
    }, 1000);
  };

  // Generate available time slots for the selected date
  const getAvailableTimeSlots = () => {
    return [
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
      '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
      '4:00 PM', '4:30 PM'
    ];
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

  if (loading) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>Loading pet information...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="pet-not-found">
        <h2>Pet Not Found</h2>
        <p>We couldn't find the pet you're looking for.</p>
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
          <p>Book a time to meet {pet.name} at {pet.location}</p>
        </div>

        <div className="booking-content">
          <div className="pet-summary">
            <div className="pet-image">
              <img src={pet.image} alt={pet.name} />
            </div>
            <div className="pet-info">
              <h2>{pet.name}</h2>
              <p>{pet.breed} • {pet.type}</p>
              <p className="pet-location">{pet.location}</p>
            </div>
          </div>

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
                  disabled={!formData.date}
                >
                  <option value="">Select a time</option>
                  {formData.date && getAvailableTimeSlots().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
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
              ></textarea>
            </div>

            <button type="submit" className="submit-booking-btn">
              Confirm Booking
            </button>
          </form>

          <div className="booking-info">
            <h3>What to Expect</h3>
            <p>During your meet and greet, you'll have the opportunity to interact with {pet.name} and speak with our adoption counselors who can answer any questions you may have about {pet.name}'s personality, health, and care requirements.</p>
            <p>Please arrive 10 minutes before your scheduled appointment. If you need to reschedule, please do so at least 24 hours in advance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 