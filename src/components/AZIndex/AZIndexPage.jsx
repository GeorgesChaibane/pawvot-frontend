import React from 'react';
import { Link } from 'react-router-dom';
import './AZIndexPage.css';

const AZIndexPage = () => {
  // Define all the links to be displayed in the A-Z index
  const azData = {
    A: [
      { name: 'About Us', path: '/about' },
      { name: 'Adoption Process', path: '/adoption-process' },
      { name: 'Adoption Services', path: '/adoption-services' },
      { name: 'All Pets', path: '/pets' }
    ],
    B: [
      { name: 'Blog', path: '/blog' },
      { name: 'Bookings', path: '/bookings' }
    ],
    C: [
      { name: 'Cart', path: '/cart' },
      { name: 'Checkout', path: '/checkout' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Customer Service', path: '/customer-service' }
    ],
    D: [
      { name: 'Dog Products', path: '/products/dog' },
      { name: 'Donation', path: '/donation' }
    ],
    E: [
      { name: 'Events', path: '/events' }
    ],
    F: [
      { name: 'FAQ', path: '/faq' },
      { name: 'Forgot Password', path: '/forgot-password' }
    ],
    G: [
      { name: 'Gift Cards', path: '/gift-cards' }
    ],
    H: [
      { name: 'Home', path: '/' },
      { name: 'How It Works', path: '/how-it-works' }
    ],
    L: [
      { name: 'Legal Information', path: '/legal' },
      { name: 'Login', path: '/login' }
    ],
    M: [
      { name: 'My Account', path: '/account' }
    ],
    N: [
      { name: 'Newsletter', path: '/newsletter' }
    ],
    O: [
      { name: 'Order History', path: '/orders' }
    ],
    P: [
      { name: 'Pawvot Rewards', path: '/rewards' },
      { name: 'Pet Adoption', path: '/pet-adoption' },
      { name: 'Pet Care', path: '/pet-care' },
      { name: 'Pet Profile', path: '/pet-profile' },
      { name: 'Pet Products', path: '/products' },
      { name: 'Privacy Policy', path: '/privacy-policy' }
    ],
    R: [
      { name: 'Returns & Refunds', path: '/returns' }
    ],
    S: [
      { name: 'Shipping', path: '/shipping' },
      { name: 'Shop', path: '/products' },
      { name: 'Signup', path: '/signup' },
      { name: 'Sitemap', path: '/a-z-index' },
      { name: 'Support', path: '/support' }
    ],
    T: [
      { name: 'Terms & Conditions', path: '/terms' },
      { name: 'Track Order', path: '/track-order' }
    ],
    V: [
      { name: 'Vet Services', path: '/vet-services' },
      { name: 'Volunteer', path: '/volunteer' }
    ],
    W: [
      { name: 'Wishlist', path: '/wishlist' }
    ]
  };

  // Get all available letters
  const letters = Object.keys(azData);
  
  // All possible letters in the alphabet
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="az-index-page">
      <div className="az-header">
        <h1>A-Z Index</h1>
        <p>Searching for specific information? This alphabetical listing provides a comprehensive overview of services, subjects, departments, and pages to assist you in your quest.</p>
      </div>

      <div className="container">
        <div className="az-letter-nav">
          {allLetters.map((letter) => (
            <a 
              key={letter} 
              href={`#${letter}`}
              className={azData[letter] ? 'available' : 'unavailable'}
            >
              {letter}
            </a>
          ))}
        </div>

        <div className="az-content">
          {allLetters.map((letter) => {
            const letterData = azData[letter] || [];
            
            // Skip rendering empty letter sections
            if (letterData.length === 0) return null;
            
            return (
              <div key={letter} id={letter} className="az-letter-section">
                <h2>{letter}</h2>
                <ul>
                  {letterData.map((item, index) => (
                    <li key={index}>
                      <Link to={item.path}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AZIndexPage; 