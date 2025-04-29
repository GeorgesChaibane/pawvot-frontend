import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/pawvot-logo-removebg-preview.png';
import searchIcon from '../assets/images/search-nav.png';
import './navbar.css';

const Navbar = ({ onSearch }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [cartItems, setCartItems] = useState([]);

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
        const getCartItems = () => {
            const items = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCartItems(items);
        };

        getCartItems();
        
        // Listen for storage events to update cart count when cart changes
        const handleStorageChange = (e) => {
            if (e.key === 'cartItems') {
                getCartItems();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Check cart every 2 seconds as a fallback
        const interval = setInterval(getCartItems, 2000);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(searchQuery);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Calculate total number of items in cart
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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
                            />
                        </div>
                        <button type="submit" className="search-button">Search</button>
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
                                <li><Link to="/account/orders" onClick={closeMenu}>Orders</Link></li>
                                <li>
                                    <Link to="/cart" onClick={closeMenu} className="cart-link">
                                        <span className="cart-icon">🛒</span> 
                                        Cart
                                        {cartItemCount > 0 && (
                                            <span className="cart-count">{cartItemCount}</span>
                                        )}
                                    </Link>
                                </li>
                                {isMobile && (
                                    <>
                                        <li><Link to="/signup" onClick={closeMenu}>Signup</Link></li>
                                        <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
                                    </>
                                )}
                            </ul>
                        </nav>
                        
                        {!isMobile && (
                            <div className="auth-buttons">
                                <Link to="/signup" className="login-signup">Signup</Link>
                                <Link to="/login" className="login-signup">Login</Link>
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