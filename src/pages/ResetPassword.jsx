import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const { error: updateError } = await supabase.auth.updateUser({
        password
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess('Your password has been changed successfully.');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Password update error:', err);
      setError(err?.message || 'Unable to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        {/* HEADER */}
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
              boxShadow: '0 6px 15px rgba(58, 42, 22, 0.15)'
            }}
          >
            <Lock size={30} />
          </div>

          <h1 style={{ margin: 0, color: '#3A2A16', fontSize: '27px', fontWeight: '900' }}>
            Placement HR
          </h1>
          <h2 style={{ margin: '4px 0 0', color: '#3A2A16', fontSize: '20px', fontWeight: '800' }}>
            Management
          </h2>
          <p style={{ marginTop: '10px', marginBottom: 0, color: '#5C4A32', fontSize: '14px', fontWeight: '600' }}>
            Create a new password
          </p>
        </div>

        {/* TITLE */}
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ margin: 0, color: '#3A2A16', fontSize: '20px', fontWeight: '900' }}>
            Reset Password
          </h3>
          <p style={{ marginTop: '7px', marginBottom: 0, color: '#5C4A32', fontSize: '13px', fontWeight: '600', lineHeight: '1.5' }}>
            Enter your new password below.
          </p>
        </div>

        {/* SUCCESS */}
        {success && (
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
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginBottom: '18px',
              padding: '11px 13px',
              borderRadius: '10px',
              background: '#FDECEC',
              border: '1px solid #D88',
              color: '#9B1C1C',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* NEW PASSWORD */}
          <div style={{ marginBottom: '18px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '7px', color: '#3A2A16', fontSize: '13px', fontWeight: '800' }}>
              New Password
            </label>

            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                autoComplete="new-password"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 48px 13px 15px',
                  borderRadius: '12px',
                  border: '1.5px solid #BDB76B',
                  background: '#FDFBD4',
                  color: '#3A2A16',
                  fontSize: '14px',
                  fontWeight: '600',
                  outline: 'none'
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#5C4A32',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <p style={{ marginTop: '6px', marginBottom: 0, color: '#5C4A32', fontSize: '11px', fontWeight: '600' }}>
              Minimum 6 characters
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '7px', color: '#3A2A16', fontSize: '13px', fontWeight: '800' }}>
              Confirm New Password
            </label>

            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                autoComplete="new-password"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 48px 13px 15px',
                  borderRadius: '12px',
                  border: '1.5px solid #BDB76B',
                  background: '#FDFBD4',
                  color: '#3A2A16',
                  fontSize: '14px',
                  fontWeight: '600',
                  outline: 'none'
                }}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#5C4A32',
                  cursor: 'pointer'
                }}
              >
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* UPDATE BUTTON */}
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
              boxShadow: '0 5px 12px rgba(58, 42, 22, 0.15)'
            }}
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <div style={{ textAlign: 'center', marginTop: '22px' }}>
          <button
            type="button"
            onClick={() => navigate('/login')}
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
};

export default ResetPassword;