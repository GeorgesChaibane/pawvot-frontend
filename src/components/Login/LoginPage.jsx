import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Call login method from context
      await login(email, password);
      
      // Check if there's a returnUrl in localStorage
      const returnUrl = localStorage.getItem('returnUrl');
      
      if (returnUrl) {
        // Clear the returnUrl from localStorage
        localStorage.removeItem('returnUrl');
        // Redirect to the saved URL
        navigate(returnUrl);
      } else {
        // Redirect to homepage if no returnUrl
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   // This would be implemented with OAuth
  //   setError('Google login is not implemented yet');
  // };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome Back</h1>
        <p>Sign in to continue to Pawvot</p>
        
        {error && (
          <div className="error-message">
            <i>❌ </i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loader">
                <span className="loader-text">Logging in...</span>
                <span className="loader-spinner"></span>
              </span>
            ) : 'Login'}
          </button>
        </form>
        
        {/* <div className="divider">
          <span>OR</span>
        </div>
        
        <button 
          onClick={handleGoogleLogin} 
          className="google-button"
          disabled={loading}
        >
          Continue with Google
        </button> */}
        
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 