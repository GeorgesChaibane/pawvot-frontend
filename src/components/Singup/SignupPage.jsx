import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '+961'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Prepare user data for registration
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: `${formData.countryCode}${formData.phone}`
      };
      
      // Call register method from context
      await register(userData);
      
      // Redirect to homepage on success
      navigate('/');
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleSignup = () => {
  //   // This would be implemented with OAuth
  //   setError('Google signup is not implemented yet');
  // };

  // Country codes for select dropdown
  const countryCodes = [
    { code: '+961', country: 'Lebanon' },
    { code: '+1', country: 'United States' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+33', country: 'France' },
    // Add more as needed
  ];

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create an Account</h1>
        <p>Join Pawvot to find your perfect pet</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
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
            <label htmlFor="email">Email *</label>
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
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group phone-group">
            <label htmlFor="phone">Phone Number *</label>
            <div className="phone-input-container">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="country-code-select"
                disabled={loading}
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} ({country.country})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="phone-input"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="signup-button"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        
        {/* <div className="divider">
          <span>OR</span>
        </div>
        
        <button 
          onClick={handleGoogleSignup} 
          className="google-button"
          disabled={loading}
        >
          Continue with Google
        </button> */}
        
        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage; 