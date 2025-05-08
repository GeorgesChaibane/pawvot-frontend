import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SitemapService from '../../services/sitemapService';
import './AZIndexPage.css';

const AZIndexPage = () => {
  const [azData, setAzData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // All possible letters in the alphabet
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Fetch the dynamic A-Z index data
  useEffect(() => {
    const fetchAZIndexData = async () => {
      try {
        setLoading(true);
        const data = await SitemapService.generateAZIndex();
        setAzData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading A-Z index data:', err);
        setError('Failed to load site index. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAZIndexData();
  }, []);

  if (loading) {
    return (
      <div className="az-index-page">
        <div className="az-loading">
          <div className="az-spinner"></div>
          <p>Generating site index...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="az-index-page">
        <div className="az-error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="az-retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get letters that have content
  const activeLetters = allLetters.filter(letter => azData[letter] && azData[letter].length > 0);

  return (
    <div className="az-index-page">
      <Helmet>
        <title>A-Z Index - PawVot</title>
        <meta name="description" content="Comprehensive alphabetical directory of all pages, products, and services at PawVot - your one-stop pet adoption and shopping platform." />
        <meta name="keywords" content="pet directory, pawvot sitemap, pet adoption index, pet shop index, a to z index" />
        <link rel="canonical" href="/a-z-index" />
      </Helmet>

      <div className="az-header">
        <h1>A-Z Index</h1>
        <p>Browse our comprehensive alphabetical directory of all pages, products, and services available at PawVot.</p>
      </div>

      <nav className="az-letter-nav" aria-label="Alphabetical navigation">
        {allLetters.map((letter) => (
          <a 
            key={letter} 
            href={azData[letter] && azData[letter].length > 0 ? `#letter-${letter}` : null}
            className={azData[letter] && azData[letter].length > 0 ? 'available' : 'unavailable'}
            aria-disabled={!(azData[letter] && azData[letter].length > 0)}
          >
            {letter}
          </a>
        ))}
      </nav>

      <div className="az-content">
        {activeLetters.map((letter) => (
          <section key={letter} id={`letter-${letter}`} className="az-letter-section">
            <h2>{letter}</h2>
            <ul>
              {azData[letter].map((item, index) => (
                <li key={index}>
                  <article className="az-item">
                    <Link to={item.path}>
                      <h3>{item.name}</h3>
                    </Link>
                    {item.description && (
                      <p>{item.description}</p>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
        
        {activeLetters.length === 0 && (
          <div className="az-empty-state">
            <p>No pages found in the index. Please try again later.</p>
          </div>
        )}
      </div>

      <footer className="az-footer">
        <p>This index is automatically generated and updated regularly to include the latest content.</p>
      </footer>
    </div>
  );
};

export default AZIndexPage; 