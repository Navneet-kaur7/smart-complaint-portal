import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import './Common.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L20 10H28L22 16L24 26L16 22L8 26L10 16L4 10H12L16 2Z" fill="#ff6b35"/>
              </svg>
            </div>
            <h1 className="logo">PunishSmart</h1>
          </Link>
        </div>
        
        {user && (
          <div className="header-right">
            <span className="user-info">
              {user.fullName} ({user.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;