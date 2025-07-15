import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { forgotPassword, loading, error, message } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your email address and we'll send you a link to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default ForgotPassword;