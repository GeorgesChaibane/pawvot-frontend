import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmailVerificationPage.css';

const EmailVerificationPage = () => {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Verifying your email...');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing.');
                return;
            }

            try {
                const response = await axios.post('http://localhost:5000/api/email/verify-email', { token });
                setStatus('success');
                setMessage('Your email has been verified successfully! You can now close this tab and log in to your account.');
                
                // Auto redirect after a few seconds
                setTimeout(() => {
                    window.close(); // Try to close the tab
                    navigate('/login'); // Fallback if window.close() is blocked
                }, 5000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Email verification failed. The token may be invalid or expired.');
            }
        };

        verifyEmail();
    }, [location.search, navigate]);

    return (
        <div className="email-verification-page">
            <div className="verification-container">
                {status === 'loading' && (
                    <div className="loading-spinner"></div>
                )}
                
                {status === 'success' && (
                    <div className="success-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4BB543" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="error-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    </div>
                )}
                
                <h1>Email Verification</h1>
                <p className="verification-message">{message}</p>
                
                {status === 'success' && (
                    <div className="action-buttons">
                        <button 
                            className="login-btn"
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </button>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="action-buttons">
                        <button 
                            className="retry-btn"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                        <button 
                            className="home-btn"
                            onClick={() => navigate('/')}
                        >
                            Go to Homepage
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerificationPage; 