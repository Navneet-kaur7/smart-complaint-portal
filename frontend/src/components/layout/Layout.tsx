import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Header from '../common/Header';
import Footer from '../common/Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="layout">
      {isAuthenticated && <Header />}
      <main className="main-content">
        {children}
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
};

export default Layout;