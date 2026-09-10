import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BriefcaseBusiness, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    title: '',
    college: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!form.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!form.password) {
      setError('Please enter a password.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (!form.phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    if (!form.title.trim()) {
      setError('Please enter your title.');
      return;
    }

    if (!form.college.trim()) {
      setError('Please enter your college name.');
      return;
    }

    if (!agreeToTerms) {
      setError(
        'Please agree to the Terms of Use and Privacy Policy.'
      );
      return;
    }

    try {
      setLoading(true);

      await signup(
        form.name.trim(),
        form.email.trim(),
        form.password,
        form.title.trim(),
        form.college.trim(),
        form.phone.trim()
      );

      setSuccess('Account created successfully.');

      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      console.error('Signup error:', err);

      setError(
        err?.message ||
          'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        {/* LEFT SIDE */}
        <div className="signup-info">

          <div className="signup-brand">
            <div className="signup-brand-icon">
              <BriefcaseBusiness
                size={24}
                strokeWidth={2.2}
              />
            </div>

            <span>Placement HR Management</span>
          </div>

          <div className="signup-info-content">

            <h1>Placement HR Management</h1>

            <p>
              Manage HR contacts, placement activities and
              follow-ups efficiently in one place.
            </p>

            <div className="signup-feature-list">

              <div className="signup-feature">
                <div className="signup-check">
                  <Check size={15} />
                </div>

                <span>Manage HR contacts</span>
              </div>

              <div className="signup-feature">
                <div className="signup-check">
                  <Check size={15} />
                </div>

                <span>Track placement activities</span>
              </div>

              <div className="signup-feature">
                <div className="signup-check">
                  <Check size={15} />
                </div>

                <span>Never miss an HR follow-up</span>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="signup-form-section">

          <div className="signup-heading">
            <h2>Create Account</h2>

            <p>
              Enter your details to get started
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="signup-message signup-error">
              {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="signup-message signup-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}
            <div className="signup-form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
              />

            </div>

            {/* EMAIL */}
            <div className="signup-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
              />

            </div>

            {/* PASSWORD */}
            <div className="signup-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="signup-password-wrapper">

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="signup-show-password"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}

                  <span>Show</span>

                </button>

              </div>

              <small>
                Minimum 6 characters
              </small>

            </div>

            {/* PHONE */}
            <div className="signup-form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
              />

            </div>

            {/* TITLE */}
            <div className="signup-form-group">

              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter your title"
              />

            </div>

            {/* COLLEGE */}
            <div className="signup-form-group">

              <label htmlFor="college">
                College
              </label>

              <input
                id="college"
                name="college"
                type="text"
                value={form.college}
                onChange={handleChange}
                placeholder="Enter your college name"
              />

            </div>

            {/* TERMS */}
            <div className="signup-terms">

              <label className="signup-checkbox-label">

                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) =>
                    setAgreeToTerms(
                      e.target.checked
                    )
                  }
                />

                <span>
                  I agree to the{' '}

                  <button
                    type="button"
                    className="signup-inline-link"
                  >
                    Terms of Use
                  </button>

                  {' '}and{' '}

                  <button
                    type="button"
                    className="signup-inline-link"
                  >
                    Privacy Policy
                  </button>
                </span>

              </label>

            </div>

            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </button>

          </form>

          {/* LOGIN */}
          <div className="signup-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Signup;