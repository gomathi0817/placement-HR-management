import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useApp } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useApp();

  // =========================================================
  // LOGIN STATE
  // =========================================================

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // =========================================================
  // FORGOT PASSWORD STATE
  // =========================================================

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Invalid email or password.');
    }
  };

  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');

    if (!resetEmail.trim()) {
      setResetError('Please enter your email address.');
      return;
    }

    try {
      setResetLoading(true);
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim(),
        { redirectTo: redirectUrl }
      );

      if (error) throw error;

      setResetMessage('Password reset link has been sent to your email address. Please check your inbox.');
    } catch (err) {
      console.error('Password reset error:', err);
      setResetError(err?.message || 'Unable to send password reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  // =========================================================
  // SHOW LOGIN
  // =========================================================

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setResetError('');
    setResetMessage('');
  };

  // =========================================================
  // FORGOT PASSWORD PAGE
  // =========================================================

  if (showForgotPassword) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#FDFBD4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Forgot Password Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '430px',
            background: '#FFFFFF',
            border: '2px solid #D4AF37',
            borderRadius: '24px',
            padding: '35px 30px',
            boxShadow: '0 12px 30px rgba(58, 42, 22, 0.15)'
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                margin: '0 auto 15px',
                borderRadius: '20px',
                background: '#D4AF37',
                color: '#3A2A16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '25px',
                fontWeight: '900',
                boxShadow: '0 6px 15px rgba(58, 42, 22, 0.15)'
              }}
            >
              PO
            </div>

            <h1 style={{ margin: 0, color: '#3A2A16', fontSize: '27px', fontWeight: '900' }}>
              Placement HR
            </h1>
            <h2 style={{ margin: '4px 0 0', color: '#3A2A16', fontSize: '20px', fontWeight: '800' }}>
              Management
            </h2>
            <p style={{ marginTop: '10px', marginBottom: 0, color: '#5C4A32', fontSize: '14px', fontWeight: '600' }}>
              Reset your password
            </p>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ margin: 0, color: '#3A2A16', fontSize: '20px', fontWeight: '900' }}>
              Forgot Password?
            </h3>
            <p style={{ marginTop: '7px', marginBottom: 0, color: '#5C4A32', fontSize: '13px', fontWeight: '600', lineHeight: '1.5' }}>
              Enter your registered email address and we will send you a link to reset your password.
            </p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleForgotPassword}>
            <div style={{ marginBottom: '18px' }}>
              <label
                htmlFor="resetEmail"
                style={{ display: 'block', marginBottom: '7px', color: '#3A2A16', fontSize: '13px', fontWeight: '800' }}
              >
                Email Address
              </label>

              <input
                id="resetEmail"
                type="email"
                placeholder="Enter your registered email"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setResetError('');
                  setResetMessage('');
                }}
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 15px',
                  borderRadius: '12px',
                  border: '1.5px solid #BDB76B',
                  background: '#FDFBD4',
                  color: '#3A2A16',
                  fontSize: '14px',
                  fontWeight: '600',
                  outline: 'none'
                }}
              />
            </div>

            {/* Success */}
            {resetMessage && (
              <div
                style={{
                  marginBottom: '18px',
                  padding: '11px 13px',
                  borderRadius: '10px',
                  background: '#ECFDF3',
                  border: '1px solid #9FD5B2',
                  color: '#176B36',
                  fontSize: '13px',
                  fontWeight: '600',
                  lineHeight: '1.5'
                }}
              >
                {resetMessage}
              </div>
            )}

            {/* Error */}
            {resetError && (
              <div
                style={{
                  marginBottom: '18px',
                  padding: '11px 13px',
                  borderRadius: '10px',
                  background: '#FDECEC',
                  border: '1px solid #D88',
                  color: '#9B1C1C',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                {resetError}
              </div>
            )}

            {/* Send Reset Link */}
            <button
              type="submit"
              disabled={resetLoading}
              style={{
                width: '100%',
                padding: '14px',
                border: 'none',
                borderRadius: '13px',
                background: resetLoading ? '#BDB76B' : '#D4AF37',
                color: '#3A2A16',
                fontSize: '15px',
                fontWeight: '900',
                cursor: resetLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 5px 12px rgba(58, 42, 22, 0.15)',
                transition: '0.2s'
              }}
            >
              {resetLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Back To Login */}
          <div style={{ textAlign: 'center', marginTop: '22px' }}>
            <button
              type="button"
              onClick={handleBackToLogin}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#3A2A16',
                fontSize: '13px',
                fontWeight: '900',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ← Back to Login
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '25px', marginBottom: 0, color: '#5C4A32', fontSize: '11px', fontWeight: '600' }}>
            Placement Officer HR Management System
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // LOGIN PAGE
  // =========================================================

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FDFBD4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          background: '#FFFFFF',
          border: '2px solid #D4AF37',
          borderRadius: '24px',
          padding: '35px 30px',
          boxShadow: '0 12px 30px rgba(58, 42, 22, 0.15)'
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '70px',
              height: '70px',
              margin: '0 auto 15px',
              borderRadius: '20px',
              background: '#D4AF37',
              color: '#3A2A16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '25px',
              fontWeight: '900',
              boxShadow: '0 6px 15px rgba(58, 42, 22, 0.15)'
            }}
          >
            PO
          </div>

          <h1 style={{ margin: 0, color: '#3A2A16', fontSize: '27px', fontWeight: '900' }}>
            Placement HR
          </h1>
          <h2 style={{ margin: '4px 0 0', color: '#3A2A16', fontSize: '20px', fontWeight: '800' }}>
            Management
          </h2>
          <p style={{ marginTop: '10px', marginBottom: 0, color: '#5C4A32', fontSize: '14px', fontWeight: '600' }}>
            Placement Officer Login
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '7px', color: '#3A2A16', fontSize: '13px', fontWeight: '800' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '13px 15px',
                borderRadius: '12px',
                border: '1.5px solid #BDB76B',
                background: '#FDFBD4',
                color: '#3A2A16',
                fontSize: '14px',
                fontWeight: '600',
                outline: 'none'
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
              <label htmlFor="password" style={{ color: '#3A2A16', fontSize: '13px', fontWeight: '800' }}>
                Password
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setResetEmail(email);
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#3A2A16',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Forgot Password?
              </button>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '13px 15px',
                borderRadius: '12px',
                border: '1.5px solid #BDB76B',
                background: '#FDFBD4',
                color: '#3A2A16',
                fontSize: '14px',
                fontWeight: '600',
                outline: 'none'
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: '18px',
                marginBottom: '18px',
                padding: '11px 13px',
                borderRadius: '10px',
                background: '#FDECEC',
                border: '1px solid #D88',
                color: '#9B1C1C',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              borderRadius: '13px',
              background: loading ? '#BDB76B' : '#D4AF37',
              color: '#3A2A16',
              fontSize: '15px',
              fontWeight: '900',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 5px 12px rgba(58, 42, 22, 0.15)',
              transition: '0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '25px 0 20px' }}>
          <div style={{ flex: 1, height: '1px', background: '#BDB76B' }} />
          <span style={{ color: '#5C4A32', fontSize: '12px', fontWeight: '700' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#BDB76B' }} />
        </div>

        {/* Signup */}
        <div style={{ textAlign: 'center', color: '#5C4A32', fontSize: '13px', fontWeight: '600' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#3A2A16',
              fontSize: '13px',
              fontWeight: '900',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Sign Up
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '25px', marginBottom: 0, color: '#5C4A32', fontSize: '11px', fontWeight: '600' }}>
          Placement Officer HR Management System
        </p>
      </div>
    </div>
  );
};

export default Login;