import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/home">
          <h1>ClientEcho</h1>
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/home">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers">
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink to="/analytics">
            Analytics
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation; 