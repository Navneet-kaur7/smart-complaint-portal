import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types/user.types';
import './Landing.css';

const Landing: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by context
      console.error('Login error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <span className="logo-text">PunishSmart</span>
        </div>
        <nav className="landing-nav">
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1><span className="brand-name">PunishSmart</span><br />Complaint Portal</h1>
              <p>Streamline your complaint management process with our intelligent portal. Submit, track, and resolve complaints efficiently with complete transparency.</p>
              <div className="hero-buttons">
            <Link to="/register" className="btn-get-started">Get Started Free</Link>
            <Link to="/login" className="btn-sign-in">Sign In</Link>
          </div>
            </div>
            <div className="hero-image">
              <div className="login-card">
                <h2>Welcome to PunishSmart</h2>
                {error && <div className="error-message">{error}</div>}
                <form className="login-form" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      placeholder="Enter Your Email" 
                      value={credentials.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                      type="password" 
                      id="password"
                      name="password"
                      placeholder="Enter Your Password" 
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                    <div className="password-options">
                      <div className="remember-me">
                        <input 
                          type="checkbox" 
                          id="remember" 
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                          disabled={loading}
                        />
                        <label htmlFor="remember">Remember Me</label>
                      </div>
                      <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="login-button"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                  <p className="signup-text">Don't have an account? <Link to="/register">Create Account</Link></p>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <h2 className="section-title">Why Choose PunishSmart?</h2>
          <p className="section-subtitle">Our platform provides comprehensive complaint management solutions with cutting-edge technology</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon secure"></div>
              <h3>Secure Platform</h3>
              <p>End-to-end encryption ensures your data stays safe and confidential</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon roles"></div>
              <h3>Multi-Role Support</h3>
              <p>Separate dashboards for consumers, reviewers, and administrators</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon tracking"></div>
              <h3>Smart Tracking</h3>
              <p>Real-time status updates and intelligent complaint categorization</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon analytics"></div>
              <h3>Analytics Dashboard</h3>
              <p>Comprehensive reporting and insights for better decision making</p>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-container">
            <div className="stat-item">
              <div className="stat-icon complaints"></div>
              <div className="stat-number">10K+</div>
              <div className="stat-label">Complaints Resolved</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon users"></div>
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Users</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon uptime"></div>
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime Guaranteed</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2023 PunishSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;