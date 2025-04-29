import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Welcome to ClientEcho</h1>
        <p className="tagline">Your Customer's Voice, Amplified</p>
        <div className="cta-buttons">
          <Link to="/dashboard" className="cta-button primary">Get Started</Link>
          <Link to="/register" className="cta-button secondary">Register Your Business</Link>
        </div>
      </section>

      <section className="features-section">
        <h2>What is ClientEcho?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🎯 Customer Feedback Collection</h3>
            <p>Easily gather and organize customer feedback through our intuitive feedback forms.</p>
          </div>
          <div className="feature-card">
            <h3>📊 Feedback Analytics</h3>
            <p>Track customer satisfaction ratings and analyze feedback trends over time.</p>
          </div>
          <div className="feature-card">
            <h3>👥 Customer Insights</h3>
            <p>Understand your customers better with detailed feedback and rating history.</p>
          </div>
          <div className="feature-card">
            <h3>📈 Performance Tracking</h3>
            <p>Monitor your business's performance through customer satisfaction metrics.</p>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <h2>Why Use ClientEcho?</h2>
        <div className="benefits-content">
          <div className="benefit-item">
            <h3>1. Simple Feedback Collection</h3>
            <p>Our easy-to-use feedback forms make it simple for customers to share their thoughts.</p>
          </div>
          <div className="benefit-item">
            <h3>2. Customer History Tracking</h3>
            <p>Keep track of customer feedback history and build stronger relationships.</p>
          </div>
          <div className="benefit-item">
            <h3>3. Data-Driven Decisions</h3>
            <p>Make informed business decisions based on real customer feedback.</p>
          </div>
          <div className="benefit-item">
            <h3>4. Customer Satisfaction Monitoring</h3>
            <p>Track and improve your customer satisfaction ratings over time.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Start Collecting Customer Feedback Today</h2>
        <p>Join ClientEcho and begin understanding your customers better.</p>
        <Link to="/register" className="cta-button primary">Register Your Business</Link>
      </section>
    </div>
  );
}

export default HomePage; 