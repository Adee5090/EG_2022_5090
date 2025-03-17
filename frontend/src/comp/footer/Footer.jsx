import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="lms-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <ul className="social-links">
            <li><a href="#" aria-label="Facebook"><FaFacebook /></a></li>
            <li><a href="#" aria-label="Twitter"><FaTwitter /></a></li>
            <li><a href="#" aria-label="LinkedIn"><FaLinkedin /></a></li>
            <li><a href="#" aria-label="Instagram"><FaInstagram /></a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Newsletter</h3>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Ewinners.lk. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
