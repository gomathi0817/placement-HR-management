import React, { useState } from 'react';
import {
  Bell,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const Settings = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  // =========================================================
  // REMINDER SETTINGS
  // =========================================================

  const [reminderLeadTime, setReminderLeadTime] =
    useState('15 minutes before');

  const [soundAlerts, setSoundAlerts] =
    useState(true);

  const [emailDigest, setEmailDigest] =
    useState(true);

  // =========================================================
  // PASSWORD SETTINGS
  // =========================================================

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState('');

  const [passwordError, setPasswordError] =
    useState('');

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage('');
    setPasswordError('');

    // Validate new password
    if (!newPassword) {
      setPasswordError(
        'Please enter a new password.'
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        'New password must contain at least 6 characters.'
      );
      return;
    }

    // Validate confirmation
    if (!confirmPassword) {
      setPasswordError(
        'Please confirm your new password.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        'New password and confirm password do not match.'
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await authService.changePassword(
        newPassword
      );

      setPasswordMessage(
        'Password changed successfully.'
      );

      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error(
        'Change password error:',
        error
      );

      setPasswordError(
        error?.message ||
          'Unable to change password. Please try again.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom">

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-darkText">
            System Settings & Preferences
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-darkText/70 mt-1">
            Officer profile configuration and reminder preferences.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-2xl shadow flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />

          <span>
            Logout
          </span>
        </button>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="max-w-4xl space-y-6">

        {/* ===================================================
            OFFICER PROFILE
        =================================================== */}

        <div className="bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom space-y-4">

          <div className="flex items-center gap-3 border-b border-olive/40 pb-4">

            <div className="w-12 h-12 rounded-2xl bg-primary text-darkText border-2 border-olive font-black flex items-center justify-center text-lg shadow">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : 'P'}
            </div>

            <div>

              <h3 className="font-extrabold text-base text-darkText">
                {user?.name || 'Placement Officer'}
              </h3>

              <p className="text-xs text-darkText/70 font-semibold">

                {user?.title || ''}

                {user?.college
                  ? ` — ${user.college}`
                  : ''}

              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

            {/* EMAIL */}

            <div>

              <label className="block font-bold text-darkText mb-1">
                Official Email
              </label>

              <input
                type="email"
                disabled
                value={user?.email || ''}
                placeholder="Not provided"
                className="w-full p-3 bg-cream border border-olive/50 rounded-xl font-bold text-darkText"
              />

            </div>

            {/* PHONE */}

            <div>

              <label className="block font-bold text-darkText mb-1">
                Contact Phone
              </label>

              <input
                type="text"
                disabled
                value={user?.phone || ''}
                placeholder="Not provided"
                className="w-full p-3 bg-cream border border-olive/50 rounded-xl font-bold text-darkText"
              />

            </div>

          </div>

        </div>

        {/* ===================================================
            CHANGE PASSWORD
        =================================================== */}

        <div className="bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom">

          {/* TITLE */}

          <div className="flex items-center gap-3 border-b border-olive/40 pb-4 mb-5">

            <div className="w-10 h-10 rounded-xl bg-primary text-darkText flex items-center justify-center">

              <Lock className="w-5 h-5" />

            </div>

            <div>

              <h3 className="font-extrabold text-base text-darkText">
                Change Password
              </h3>

              <p className="text-xs text-darkText/70 font-semibold mt-1">
                Update your account password securely.
              </p>

            </div>

          </div>

          {/* SUCCESS MESSAGE */}

          {passwordMessage && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold">

              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />

              <span>
                {passwordMessage}
              </span>

            </div>
          )}

          {/* ERROR MESSAGE */}

          {passwordError && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">

              <AlertCircle className="w-4 h-4 flex-shrink-0" />

              <span>
                {passwordError}
              </span>

            </div>
          )}

          <form
            onSubmit={handleChangePassword}
            className="space-y-4"
          >

            {/* NEW PASSWORD */}

            <div>

              <label
                htmlFor="newPassword"
                className="block font-bold text-darkText text-xs mb-1"
              >
                New Password
              </label>

              <div className="relative">

                <input
                  id="newPassword"
                  type={
                    showNewPassword
                      ? 'text'
                      : 'password'
                  }
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(
                      e.target.value
                    );
                    setPasswordError('');
                    setPasswordMessage('');
                  }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="w-full p-3 pr-12 bg-cream border border-olive/50 rounded-xl font-bold text-darkText outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-darkText/60 hover:text-darkText"
                  aria-label={
                    showNewPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

              </div>

              <p className="text-[11px] text-darkText/70 mt-1">
                Minimum 6 characters
              </p>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="block font-bold text-darkText text-xs mb-1"
              >
                Confirm New Password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(
                      e.target.value
                    );
                    setPasswordError('');
                    setPasswordMessage('');
                  }}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="w-full p-3 pr-12 bg-cream border border-olive/50 rounded-xl font-bold text-darkText outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-darkText/60 hover:text-darkText"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

              </div>

            </div>

            {/* BUTTON */}

            <div className="pt-2">

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-3 bg-primary hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed text-darkText font-black text-xs rounded-xl shadow transition-all"
              >

                {passwordLoading
                  ? 'Updating Password...'
                  : 'Change Password'}

              </button>

            </div>

          </form>

        </div>

        {/* ===================================================
            REMINDER PREFERENCES
        =================================================== */}

        <div className="bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom space-y-4">

          <div className="flex items-center gap-2 border-b border-olive/40 pb-3">

            <Bell className="w-5 h-5 text-primary" />

            <h3 className="font-extrabold text-base text-darkText">
              Reminder Preferences
            </h3>

          </div>

          <div className="space-y-4 text-xs">

            {/* REMINDER TIME */}

            <div>

              <label className="block font-bold text-darkText mb-1">
                Default Reminder Lead-Time
              </label>

              <select
                value={reminderLeadTime}
                onChange={(e) =>
                  setReminderLeadTime(
                    e.target.value
                  )
                }
                className="w-full max-w-xs p-3 bg-cream border border-olive rounded-xl font-bold text-darkText"
              >

                <option value="At scheduled time">
                  At scheduled time
                </option>

                <option value="15 minutes before">
                  15 minutes before
                </option>

                <option value="30 minutes before">
                  30 minutes before
                </option>

                <option value="1 hour before">
                  1 hour before
                </option>

              </select>

            </div>

            {/* ALERT SETTINGS */}

            <div className="space-y-2 pt-2 border-t border-olive/30">

              <label className="flex items-center gap-3 cursor-pointer text-darkText font-bold">

                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) =>
                    setSoundAlerts(
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 accent-primary rounded"
                />

                <span>
                  Enable Audio Sound Chime on Active Alerts
                </span>

              </label>

              <label className="flex items-center gap-3 cursor-pointer text-darkText font-bold">

                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) =>
                    setEmailDigest(
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 accent-primary rounded"
                />

                <span>
                  Daily Morning HR Summary Digest via Email
                </span>

              </label>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;