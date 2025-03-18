import React from 'react';
import heroImage from '../assets/images/cat-and-dog-1-Photoroom.png';
import './styles/hero.css';

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="box-model">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1>Find Your Perfect Pet Companion</h1>
                        <p>Everything They Need.</p>
                        <div className="hero-actions">
                            <a href="#adopt" className="primary-btn">Adopt Now</a>
                            <a href="#shop" className="secondary-btn">Shop Now</a>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src={heroImage} alt="Hero" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection; 