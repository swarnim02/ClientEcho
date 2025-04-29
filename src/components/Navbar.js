import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">ClientEcho</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/feedback" className="nav-link">Feedback</Link>
        <Link to="/analytics" className="nav-link">Analytics</Link>
      </div>
    </nav>
  );
}

export default Navbar; 