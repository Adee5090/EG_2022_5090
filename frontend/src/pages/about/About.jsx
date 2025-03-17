import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About Us</h1>
        <p>Your trusted platform for learning and growth.</p>
      </div>
      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>We aim to empower learners worldwide by providing access to high-quality education resources and tools. Our mission is to make learning accessible, engaging, and impactful.</p>
        </section>
        <section className="about-section">
          <h2>Our Vision</h2>
          <p>To be the leading online learning platform that inspires individuals to achieve their full potential through education and skill development.</p>
        </section>
        <section className="about-section">
          <h2>Our Team</h2>
          <p>Our team consists of passionate educators, developers, and designers dedicated to creating an exceptional learning experience for everyone.</p>
        </section>
      </div>
    </div>
  );
};

export default About;
