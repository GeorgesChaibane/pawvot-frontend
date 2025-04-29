import React from 'react';
// import './styles.css';
import './styles/footer.css';
import logoImage from '../../assets/images/pawvot-logo-removebg-preview.png';
import facebookIcon from '../../assets/images/facebook.png';
import instagramIcon from '../../assets/images/instagram.png';
import tiktokIcon from '../../assets/images/tik-tok.png';
import twitterIcon from '../../assets/images/twitter.png';
import mailIcon from '../../assets/images/mail.png';
import phoneIcon from '../../assets/images/telephone.png';
import locationIcon from '../../assets/images/pin.png';
import whatsappIcon from '../../assets/images/whatsapp.png';

const Footer = () => {
  return (
    <>
      <footer>
        <div className="box-model footer-container">
          <div className="footer-section brand">
            <h4>Where Pets Find Love and Care</h4>
            <img src={logoImage} alt="Pawvot Logo" />
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="/">Privacy Policy</a></li>
              <li><a href="/">Terms & Conditions</a></li>
              <li><a href="/a-z-index">A-Z Index</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Socials</h4>
            <div className="social-icons">
              <a href="/"><img src={facebookIcon} alt="Facebook" /></a>
              <a href="/"><img src={instagramIcon} alt="Instagram" /></a>
              <a href="/"><img src={tiktokIcon} alt="TikTok" /></a>
              <a href="/"><img src={twitterIcon} alt="Twitter" /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>
              <img src={mailIcon} alt="Email" />
              <a href="mailto:info@pawvot.com">info@pawvot.com</a>
            </p>
            <p>
              <img src={phoneIcon} alt="Phone" />
              +961 03 434 440
            </p>
          </div>

          <div className="footer-section">
            <h4>Find Us</h4>
            <p>
              <img src={locationIcon} alt="Location" />
              Baabda, Lebanon, Antonine University
            </p>
          </div>
        </div>

        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Pawvot LLC. All Rights Reserved.</p>
        </div>
      </footer>

      <a href="https://wa.me/96103434440" className="whatsapp-link" target="_blank" rel="noopener noreferrer">
        <img src={whatsappIcon} alt="Chat on WhatsApp" />
      </a>
    </>
  );
};

export default Footer; 