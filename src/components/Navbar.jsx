import React, { useState } from 'react';
import logoImage from '../assets/images/pawvot-logo-removebg-preview.png';
import searchIcon from '../assets/images/search-nav.png';
import './styles/navbar.css';

const Navbar = ({ onSearch }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <div className="box-model flex">
                <a href="/" className="logo">
                    <img src={logoImage} alt="Pawvot Logo" />
                </a>
                <div className="search-container">
                    <form className="search-form" onSubmit={handleSubmit}>
                        <img src={searchIcon} alt="Search" className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by breed, product, or city"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    <button className="search-button" onClick={handleSubmit}>
                        Search
                    </button>
                </div>
                <nav className={isMenuOpen ? 'active' : ''}>
                    <ul>
                        <li><a href="#adopt">Adopt</a></li>
                        <li><a href="#shop">Shop</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
                <div className="auth-buttons">
                    <a href="/signup" className="login-signup">Signup</a>
                    <a href="/login" className="login-signup">Login</a>
                </div>
                <button className="burger-menu" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
};

export default Navbar; 