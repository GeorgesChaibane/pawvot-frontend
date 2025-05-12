import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CartService from '../services/cartService';
import SearchService from '../services/searchService';
import logoImage from '../assets/images/pawvot-logo-removebg-preview.png';
import searchIcon from '../assets/images/search-nav.png';
import './navbar.css';

const Navbar = ({ onSearch }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Get initial cart count
        updateCartCount();
        
        // Listen for storage events to update cart count when cart changes
        const handleStorageChange = () => {
            updateCartCount();
        };

        window.addEventListener('storage', handleStorageChange);
        
        // We don't need to poll anymore since we're using the proper events
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateCartCount = () => {
        setCartItemCount(CartService.getCartItemCount());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) return;
        
        try {
            setIsSearching(true);
            
            // Lebanese locations that should redirect to pets page
            const petLocations = [
                'beirut', 'tripoli', 'sidon', 'tyre', 'jounieh', 'byblos', 'baalbek', 
                'zahle', 'aley', 'nabatieh', 'ashrafieh', 'dekwaneh', 'baabda'
            ];
            
            // Check if the search query includes a location
            const searchLower = searchQuery.toLowerCase();
            const isLocationSearch = petLocations.some(location => 
                searchLower.includes(location.toLowerCase())
            );
            
            // If it's a location, prioritize pets page
            if (isLocationSearch) {
                console.log(`Location detected in search: redirecting to pets page`);
                navigate(`/pets?search=${encodeURIComponent(searchQuery)}`);
                setSearchQuery('');
                closeMenu();
                setIsSearching(false);
                return;
            }
            
            // For other searches, use the advanced search service
            const results = await SearchService.search(searchQuery);
            
            // Navigate based on search response type
            if (results && results.responseType === 'pets') {
                navigate(`/pets?search=${encodeURIComponent(searchQuery)}`);
            } else if (results && results.responseType === 'products') {
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            } else {
                // Mixed results or error - favor products as default
                console.log('Using default search path (products) for query:', searchQuery);
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            }
            
            // Clear search input after submitting
            setSearchQuery('');
            closeMenu();
            
        } catch (error) {
            console.error('Search error:', error);
            // Fallback to default behavior if API fails
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        } finally {
            setIsSearching(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        closeMenu();
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/">
                        <img src={logoImage} alt="Pawvot" />
                    </Link>
                </div>
                
                <div className="navbar-search">
                    <div className="search-container">
                        <img src={searchIcon} alt="Search" className="search-icon-left" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by breed, product, or city"
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                        />
                        <button onClick={handleSubmit} className="search-button-text" disabled={isSearching}>
                            Search
                        </button>
                    </div>
                </div>
                
                <div className="nav-auth-container">
                    <div className={`nav-container ${isMenuOpen ? 'active' : ''}`}>                        
                        {/* Sidebar header with user name */}
                        {currentUser && (
                            <div className="sidebar-header">
                                <div className="sidebar-user-name">{currentUser.name}</div>
                            </div>
                        )}
                        
                        <nav>
                            <ul>
                                <li><Link to="/pets" onClick={closeMenu}>Adopt</Link></li>
                                <li><Link to="/products" onClick={closeMenu}>Shop</Link></li>
                                <li><Link to="/bookings" onClick={closeMenu}>Bookings</Link></li>
                                <li><Link to="/orders" onClick={closeMenu}>Orders</Link></li>
                                <li><Link to="/petai" onClick={closeMenu}>PawPal</Link></li>
                                <li>
                                    <Link to="/cart" onClick={closeMenu} className="cart-link">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            className="cart-icon"
                                        >
                                            <circle cx="9" cy="21" r="1"></circle>
                                            <circle cx="20" cy="21" r="1"></circle>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                        
                                        {cartItemCount > 0 && (
                                            <span className="cart-count">{cartItemCount}</span>
                                        )}
                                    </Link>
                                </li>
                                {isMobile && currentUser && (
                                    <li>
                                        <button onClick={handleLogout} className="logout-link">Logout</button>
                                    </li>
                                )}
                                {isMobile && !currentUser && (
                                    <>
                                        <li><Link to="/signup" onClick={closeMenu}>Signup</Link></li>
                                        <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
                                    </>
                                )}
                            </ul>
                        </nav>
                        
                        {!isMobile && (
                            <div className="auth-buttons">
                                {!currentUser ? (
                                    <>
                                        <Link to="/signup" className="login-signup">Signup</Link>
                                        <Link to="/login" className="login-signup">Login</Link>
                                    </>
                                ) : (
                                    <>
                                        <span className="user-name">{currentUser.name}</span>
                                        <button onClick={handleLogout} className="logout-link">Logout</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <button className="burger-menu" onClick={toggleMenu} aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                
                {isMenuOpen && <div className="overlay active" onClick={closeMenu}></div>}
            </div>
        </header>
    );
};

export default Navbar; 