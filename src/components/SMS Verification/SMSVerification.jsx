import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SMSVerification.css';

const SMSVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);
  
  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);
  
  // Start countdown timer
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [timer]);
  
  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    // Update the OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear any previous errors
    if (error) setError('');
    
    // Move to next input if value is entered
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    
    // Get pasted data
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted data contains only numbers and has correct length
    if (/^\d{4}$/.test(pastedData)) {
      // Update OTP state with pasted digits
      setOtp(pastedData.split(''));
      
      // Focus the last input
      inputRefs.current[3].focus();
    }
  };
  
  const resendOTP = () => {
    // Reset timer
    setTimer(60);
    
    // Clear current OTP
    setOtp(['', '', '', '']);
    
    // Clear errors
    setError('');
    
    // Focus first input
    inputRefs.current[0].focus();
    
    // Simulate sending new OTP
    console.log('Resending OTP...');
  };
  
  const verifyOTP = () => {
    // Check if OTP is complete
    if (otp.some(digit => digit === '')) {
      setError('Please enter the complete OTP');
      return;
    }
    
    // Combine OTP digits
    const otpString = otp.join('');
    
    // Simulate OTP verification
    // In a real app, this would be an API call
    if (otpString === '1234') { // Example verification
      setSuccess(true);
      
      // After showing success message, navigate to appropriate page
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };
  
  return (
    <div className="sms-verification-container">
      <div className="verification-box">
        <h1>Verify Your Number</h1>
        <p className="verification-info">
          We've sent a 4-digit code to your phone number. Please enter it below.
        </p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Verification successful!</div>}
        
        <div className="otp-input-container" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
              autoFocus={index === 0}
            />
          ))}
        </div>
        
        <button 
          className="verify-button" 
          onClick={verifyOTP}
          disabled={success}
        >
          Verify
        </button>
        
        <div className="resend-container">
          {timer > 0 ? (
            <p>Resend code in <span className="timer">{timer}s</span></p>
          ) : (
            <button 
              className="resend-button" 
              onClick={resendOTP}
              disabled={success}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMSVerification; 