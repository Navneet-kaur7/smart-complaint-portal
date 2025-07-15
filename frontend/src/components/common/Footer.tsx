import React from 'react';
import './Common.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <div className="footer-logo-icon">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L20 10H28L22 16L24 26L16 22L8 26L10 16L4 10H12L16 2Z" fill="#ff6b35"/>
            </svg>
          </div>
          <span className="footer-brand">PunishSmart</span>
        </div>
        <p className="footer-text">
          &copy; 2025 PunishSmart Complaint Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;