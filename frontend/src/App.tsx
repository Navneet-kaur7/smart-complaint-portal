import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './types/user.types';
import Layout from './components/layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ConsumerDashboard from './components/Dashboard/ConsumerDashboard';
import ReviewerDashboard from './components/Dashboard/ReviewerDashboard';
import Loading from './components/common/Loading';
import './App.css';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard Route Component
const DashboardRoute: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === UserRole.CONSUMER) {
    return <ConsumerDashboard />;
  } else if (user?.role === UserRole.REVIEWER) {
    return <ReviewerDashboard />;
  }

  return <Navigate to="/login" replace />;
};

// App Router Component
const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Register />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
