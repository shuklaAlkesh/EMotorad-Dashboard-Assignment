import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search..."
          className="search-input"
        />
      </div>
      <div className="nav-actions">
        <button className="notification-btn">
          <span className="notification-badge">3</span>
          🔔
        </button>
        <img 
          src="/avatar.png" 
          alt="Profile" 
          className="profile-image"
        />
      </div>
    </nav>
  );
};

export default Navbar; 