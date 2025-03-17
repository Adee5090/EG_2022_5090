import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Feel free to reach out.</p>
      </div>
      <div className="contact-form-container">
        <form className="contact-form">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Enter your name" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" placeholder="Write your message here..." rows="5" required></textarea>

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
