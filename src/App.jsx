import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// Mobile Custom Hooks & Components
import useAndroidBackButton from './hooks/useAndroidBackButton';
import NetworkStatusBanner from './components/NetworkStatusBanner';

// Layout Components
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { ReminderModal } from './components/ReminderModal';
import { QuickAddModal } from './components/QuickAddModal';
import { SearchModal } from './components/SearchModal';

// Modals
import { AddHRModal } from './components/modals/AddHRModal';
import { AddInteractionModal } from './components/modals/AddInteractionModal';
import { ScheduleFollowUpModal } from './components/modals/ScheduleFollowUpModal';
import { AddCompanyModal } from './components/modals/AddCompanyModal';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

import { Dashboard } from './pages/Dashboard';
import { HRContacts } from './pages/HRContacts';
import { HRProfile } from './pages/HRProfile';
import { FollowUps } from './pages/FollowUps';
import { CalendarView } from './pages/CalendarView';
import { Companies } from './pages/Companies';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';


const AppContent = () => {
  const {
    user,
    loading,
    isQuickAddOpen,
    setIsQuickAddOpen
  } = useApp();

  const location = useLocation();

  // Android back button
  useAndroidBackButton();

  // Status bar
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({
        style: Style.Dark
      }).catch(() => {});

      StatusBar.setBackgroundColor({
        color: '#D4AF37'
      }).catch(() => {});
    }
  }, []);

  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';


  const handleQuickAddOptionSelect = (optionId) => {
    setActiveModal(optionId);
  };


  // --------------------------------------------------
  // LOGIN / SIGNUP PAGES
  // --------------------------------------------------

  if (isLoginPage || isSignupPage) {

    // If already logged in, don't show login/signup pages
    if (user) {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }

    return (
      <div className="min-h-screen bg-cream font-sans pt-safe pb-safe">

        <NetworkStatusBanner />

        <Toast />

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>

      </div>
    );
  }


  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">

        <div className="text-center">

          <div className="text-3xl mb-3 text-darkText font-bold">
            Loading...
          </div>

          <p className="text-darkText/70">
            Checking authentication
          </p>

        </div>

      </div>
    );
  }


  // --------------------------------------------------
  // NOT LOGGED IN
  // --------------------------------------------------

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // --------------------------------------------------
  // MAIN APPLICATION
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans text-darkText selection:bg-primary selection:text-darkText pt-safe pb-safe">

      {/* Network Status */}
      <NetworkStatusBanner />

      <div className="flex-1 flex w-full min-h-0">

        {/* Toast */}
        <Toast />

        {/* Reminder */}
        <ReminderModal />

        {/* Search */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() =>
            setIsSearchModalOpen(false)
          }
        />

        {/* Quick Add */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() =>
            setIsQuickAddOpen(false)
          }
          onSelectOption={
            handleQuickAddOptionSelect
          }
        />


        {/* Add HR */}
        <AddHRModal
          isOpen={
            activeModal === 'addHR'
          }
          onClose={() =>
            setActiveModal(null)
          }
        />

        {/* Add Interaction */}
        <AddInteractionModal
          isOpen={
            activeModal === 'addInteraction'
          }
          onClose={() =>
            setActiveModal(null)
          }
        />

        {/* Schedule Follow Up */}
        <ScheduleFollowUpModal
          isOpen={
            activeModal === 'scheduleFollowUp'
          }
          onClose={() =>
            setActiveModal(null)
          }
        />

        {/* Add Company */}
        <AddCompanyModal
          isOpen={
            activeModal === 'addCompany'
          }
          onClose={() =>
            setActiveModal(null)
          }
        />


        {/* Sidebar */}
        <Sidebar />


        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">

          <Header
            onSearchClick={() =>
              setIsSearchModalOpen(true)
            }
          />

          <main className="flex-1">

            <Routes>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/hr"
                element={<HRContacts />}
              />

              <Route
                path="/hr/:id"
                element={<HRProfile />}
              />

              <Route
                path="/follow-ups"
                element={<FollowUps />}
              />

              <Route
                path="/calendar"
                element={<CalendarView />}
              />

              <Route
                path="/companies"
                element={<Companies />}
              />

              <Route
                path="/analytics"
                element={<Analytics />}
              />

              <Route
                path="/notifications"
                element={<Notifications />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

              <Route
                path="/"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />

              <Route
                path="*"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />

            </Routes>

          </main>

          {/* Mobile Navigation */}
          <MobileBottomNav />

        </div>

      </div>

    </div>
  );
};


export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}