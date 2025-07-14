import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/' && !isAuthenticated;

  return (
    <div className={`layout ${isLandingPage ? 'landing-layout' : ''}`}>
      {!isLandingPage && <Header />}
      <main className={`main-content ${isLandingPage ? 'landing-content' : ''}`}>
        {children}
      </main>
      {!isLandingPage && <Footer />}
    </div>
  );
};

export default Layout;