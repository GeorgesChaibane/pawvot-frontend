import React from 'react';
import heroImage from '../../assets/images/cat-and-dog-1-Photoroom-crop.png';
import './styles/hero.css';

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="box-model">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1>Find Your Perfect Pet &amp; Everything They Need.</h1>
                        <p>Adopt, shop, and care for pets with love.</p>
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