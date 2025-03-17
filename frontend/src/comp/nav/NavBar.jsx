import React, { useState } from 'react';
import './NavBar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="lms-navbar">
      <div className="navbar-logo">
        <a href="/">Ewinners.lk</a>
      </div>
      <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <a href="/dashboard">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/user/edit">Profile</a>
      </div>
      <div className="navbar-profile">
        <a href="/user/edit">Profile</a>
      </div>
      <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
