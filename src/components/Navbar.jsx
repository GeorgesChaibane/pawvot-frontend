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
            
            // Use the advanced search service
            const results = await SearchService.search(searchQuery);
            
            // Navigate based on search response type
            if (results.responseType === 'pets') {
                navigate(`/pets?search=${encodeURIComponent(searchQuery)}`);
            } else if (results.responseType === 'products') {
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            } else {
                // Mixed results - favor products as default
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
        <header>
            <div className="box-model flex">
                <Link to="/" className="logo">
                    <img src={logoImage} alt="Pawvot Logo" />
                </Link>
                
                <div className="search-container">
                    <form className="search-form" onSubmit={handleSubmit}>
                        <div className="input-with-icon">
                            <img src={searchIcon} alt="Search" className="search-icon" />
                            <input
                                placeholder="Search by breed, product, or city"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                disabled={isSearching}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="search-button" 
                            disabled={isSearching}
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>
                
                <div className="nav-auth-container">
                    <button className="burger-menu" onClick={toggleMenu} aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    
                    <div className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
                        <nav>
                            <ul>
                                <li><Link to="/pets" onClick={closeMenu}>Adopt</Link></li>
                                <li><Link to="/products" onClick={closeMenu}>Shop</Link></li>
                                <li><Link to="/bookings" onClick={closeMenu}>Bookings</Link></li>
                                <li><Link to="/orders" onClick={closeMenu}>Orders</Link></li>
                                <li>
                                    <Link to="/cart" onClick={closeMenu} className="cart-link">
                                        <span className="cart-icon">🛒</span> 
                                        
                                        {cartItemCount > 0 && (
                                            <span className="cart-count">{cartItemCount}</span>
                                        )}
                                    </Link>
                                </li>
                                {isMobile && (
                                    <>
                                        {!currentUser ? (
                                            <>
                                                <li><Link to="/signup" onClick={closeMenu}>Signup</Link></li>
                                                <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
                                            </>
                                        ) : (
                                            <>
                                                <li>
                                                    <span className="user-name">{currentUser.name}</span>
                                                </li>
                                                <li>
                                                    <button onClick={handleLogout} className="logout-link">Logout</button>
                                                </li>
                                            </>
                                        )}
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
                                        <Link to="/" onClick={handleLogout} className="login-signup">Logout</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
            </div>
        </header>
    );
};

export default Navbar; 