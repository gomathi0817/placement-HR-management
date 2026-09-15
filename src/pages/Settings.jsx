import React, { useState } from 'react';
import {
  Bell,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  UserRound,
  ShieldCheck,
  Clock3,
  Mail,
  Phone,
  Building2,
  Settings as SettingsIcon,
  ChevronRight
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

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : '?';

  return (
    <main className="min-h-full w-full bg-[#FDFBD4] px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-12">

      <div className="mx-auto w-full max-w-5xl">

        {/* ===================================================
            HEADER
        =================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-[#D7B943] bg-white p-5 shadow-[0_12px_35px_rgba(58,42,22,0.07)] sm:p-7">

          <div className="absolute left-0 top-0 h-1 w-full bg-[#D4AF37]" />

          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                  <SettingsIcon size={20} />
                </div>

                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#A65D20]">
                  PlaceSync
                </span>

              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-[#3A2A16] sm:text-3xl">
                Settings
              </h1>

              <p className="mt-1 max-w-xl text-[11px] font-medium leading-5 text-[#81776B] sm:text-xs">
                Manage your account, security and placement reminder preferences.
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#A33D3D] px-5 py-2.5 text-[9px] font-black text-white transition hover:bg-[#8E3232] sm:self-auto"
            >
              <LogOut size={14} />
              Logout
            </button>

          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D4AF37] opacity-10" />

        </section>

        {/* ===================================================
            PROFILE
        =================================================== */}

        <section className="mt-5 rounded-[28px] border border-[#E3DAC6] bg-white p-5 shadow-[0_8px_26px_rgba(58,42,22,0.04)] sm:p-6">

          <div className="flex items-start gap-3 border-b border-[#EEE8D9] pb-5">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3A2A16] text-base font-black text-[#FDFBD4]">
              {userInitial}
            </div>

            <div className="min-w-0">

              <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                Account Profile
              </p>

              <h2 className="mt-1 truncate text-base font-black text-[#3A2A16]">
                {user?.name || 'Profile'}
              </h2>

              <p className="mt-1 text-[9px] font-medium text-[#958A7D]">
                {user?.title || 'Placement Officer'}
                {user?.college
                  ? ` · ${user.college}`
                  : ''}
              </p>

            </div>

          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* EMAIL */}

            <div className="rounded-2xl border border-[#E8E0D0] bg-[#FCFBF7] p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDFBD4] text-[#3A2A16]">
                  <Mail size={14} />
                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-black uppercase tracking-wider text-[#958A7D]">
                    Official Email
                  </p>

                  <p className="mt-1 truncate text-[10px] font-black text-[#4D4131]">
                    {user?.email || 'Not provided'}
                  </p>

                </div>

              </div>

            </div>

            {/* PHONE */}

            <div className="rounded-2xl border border-[#E8E0D0] bg-[#FCFBF7] p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF9F2] text-[#A65D20]">
                  <Phone size={14} />
                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-black uppercase tracking-wider text-[#958A7D]">
                    Contact Phone
                  </p>

                  <p className="mt-1 truncate text-[10px] font-black text-[#4D4131]">
                    {user?.phone || 'Not provided'}
                  </p>

                </div>

              </div>

            </div>

            {/* TITLE */}

            <div className="rounded-2xl border border-[#E8E0D0] bg-[#FCFBF7] p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7FBF8] text-[#3E7650]">
                  <UserRound size={14} />
                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-black uppercase tracking-wider text-[#958A7D]">
                    Role
                  </p>

                  <p className="mt-1 truncate text-[10px] font-black text-[#4D4131]">
                    {user?.title || 'Not provided'}
                  </p>

                </div>

              </div>

            </div>

            {/* COLLEGE */}

            <div className="rounded-2xl border border-[#E8E0D0] bg-[#FCFBF7] p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDFBD4] text-[#3A2A16]">
                  <Building2 size={14} />
                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-black uppercase tracking-wider text-[#958A7D]">
                    Institution
                  </p>

                  <p className="mt-1 truncate text-[10px] font-black text-[#4D4131]">
                    {user?.college || 'Not provided'}
                  </p>

                </div>

              </div>

            </div>

          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#BFD9C6] bg-[#F7FBF8] p-3">

            <ShieldCheck
              size={14}
              className="shrink-0 text-[#3E7650]"
            />

            <p className="text-[8px] font-bold leading-4 text-[#587060]">
              Your profile information is connected to your authenticated PlaceSync account.
            </p>

          </div>

        </section>

        {/* ===================================================
            SECURITY
        =================================================== */}

        <section className="mt-5 rounded-[28px] border border-[#E3DAC6] bg-white p-5 shadow-[0_8px_26px_rgba(58,42,22,0.04)] sm:p-6">

          <div className="flex items-start gap-3 border-b border-[#EEE8D9] pb-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
              <Lock size={18} />
            </div>

            <div>

              <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                Account Security
              </p>

              <h2 className="mt-1 text-base font-black text-[#3A2A16]">
                Change Password
              </h2>

              <p className="mt-1 text-[9px] font-medium text-[#958A7D]">
                Update your account password securely.
              </p>

            </div>

          </div>

          {/* SUCCESS */}

          {passwordMessage && (

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#BFD9C6] bg-[#F7FBF8] p-3 text-[9px] font-black text-[#3E7650]">

              <CheckCircle2
                size={15}
                className="shrink-0"
              />

              {passwordMessage}

            </div>

          )}

          {/* ERROR */}

          {passwordError && (

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#EBCACA] bg-[#FFF7F7] p-3 text-[9px] font-black text-[#A33D3D]">

              <AlertCircle
                size={15}
                className="shrink-0"
              />

              {passwordError}

            </div>

          )}

          <form
            onSubmit={handleChangePassword}
            className="mt-5 space-y-4"
          >

            {/* NEW PASSWORD */}

            <div>

              <label
                htmlFor="newPassword"
                className="mb-2 block text-[9px] font-black uppercase tracking-wider text-[#5D5041]"
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
                    setNewPassword(e.target.value);
                    setPasswordError('');
                    setPasswordMessage('');
                  }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#DDD4C2] bg-[#FCFBF7] p-3 pr-12 text-[10px] font-bold text-[#3A2A16] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (previous) => !previous
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#958A7D] transition hover:text-[#3A2A16]"
                  aria-label={
                    showNewPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showNewPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

              <p className="mt-1.5 text-[8px] font-medium text-[#958A7D]">
                Minimum 6 characters
              </p>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-[9px] font-black uppercase tracking-wider text-[#5D5041]"
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
                  className="w-full rounded-xl border border-[#DDD4C2] bg-[#FCFBF7] p-3 pr-12 text-[10px] font-bold text-[#3A2A16] outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#958A7D] transition hover:text-[#3A2A16]"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>

            <div className="pt-1">

              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3A2A16] px-5 py-3 text-[9px] font-black text-[#FDFBD4] transition hover:bg-[#A65D20] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Lock size={13} />

                {passwordLoading
                  ? 'Updating Password...'
                  : 'Change Password'}

                <ChevronRight size={12} />

              </button>

            </div>

          </form>

        </section>

        {/* ===================================================
            REMINDER PREFERENCES
        =================================================== */}

        <section className="mt-5 rounded-[28px] border border-[#E3DAC6] bg-white p-5 shadow-[0_8px_26px_rgba(58,42,22,0.04)] sm:p-6">

          <div className="flex items-start gap-3 border-b border-[#EEE8D9] pb-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9F2] text-[#A65D20]">
              <Bell size={18} />
            </div>

            <div>

              <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                Notifications
              </p>

              <h2 className="mt-1 text-base font-black text-[#3A2A16]">
                Reminder Preferences
              </h2>

              <p className="mt-1 text-[9px] font-medium text-[#958A7D]">
                Configure how your follow-up reminders behave.
              </p>

            </div>

          </div>

          <div className="mt-5 space-y-4">

            {/* LEAD TIME */}

            <div className="rounded-2xl border border-[#E8E0D0] bg-[#FCFBF7] p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                  <Clock3 size={16} />
                </div>

                <div>

                  <p className="text-[9px] font-black text-[#4D4131]">
                    Default Reminder Lead-Time
                  </p>

                  <p className="mt-1 text-[8px] font-medium text-[#958A7D]">
                    Choose when you want to be reminded before a follow-up.
                  </p>

                </div>

              </div>

              <select
                value={reminderLeadTime}
                onChange={(e) =>
                  setReminderLeadTime(
                    e.target.value
                  )
                }
                className="mt-4 w-full rounded-xl border border-[#DDD4C2] bg-white p-3 text-[9px] font-black text-[#4D4131] outline-none focus:border-[#D4AF37]"
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

            {/* SOUND */}

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#E8E0D0] bg-[#FCFBF7] p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                  <Bell size={16} />
                </div>

                <div>

                  <p className="text-[9px] font-black text-[#4D4131]">
                    Sound Alerts
                  </p>

                  <p className="mt-1 text-[8px] font-medium leading-4 text-[#958A7D]">
                    Play a notification sound for active alerts.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSoundAlerts(
                    (previous) => !previous
                  )
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  soundAlerts
                    ? 'bg-[#3A2A16]'
                    : 'bg-[#D8D0C2]'
                }`}
                aria-label="Toggle sound alerts"
              >

                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                    soundAlerts
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />

              </button>

            </div>

            {/* EMAIL */}

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#E8E0D0] bg-[#FCFBF7] p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF9F2] text-[#A65D20]">
                  <Mail size={16} />
                </div>

                <div>

                  <p className="text-[9px] font-black text-[#4D4131]">
                    Daily Email Digest
                  </p>

                  <p className="mt-1 text-[8px] font-medium leading-4 text-[#958A7D]">
                    Receive a daily summary of HR follow-up activity.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setEmailDigest(
                    (previous) => !previous
                  )
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  emailDigest
                    ? 'bg-[#3A2A16]'
                    : 'bg-[#D8D0C2]'
                }`}
                aria-label="Toggle email digest"
              >

                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                    emailDigest
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />

              </button>

            </div>

          </div>

        </section>

        {/* ===================================================
            SECURITY FOOTER
        =================================================== */}

        <div className="mt-5 flex items-center justify-center gap-2 px-4 text-center">

          <ShieldCheck
            size={12}
            className="text-[#958A7D]"
          />

          <p className="text-[8px] font-semibold leading-4 text-[#958A7D]">
            PlaceSync keeps your account settings connected to your authenticated profile.
          </p>

        </div>

      </div>

    </main>
  );
};

export default Settings;