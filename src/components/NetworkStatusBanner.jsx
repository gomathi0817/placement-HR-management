import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [backendStatus, setBackendStatus] = useState('checking');

  const testBackend = async () => {
    // First check internet connection
    if (!navigator.onLine) {
      setIsOffline(true);
      setBackendStatus('offline');
      return;
    }

    setIsOffline(false);
    setBackendStatus('checking');

    try {
      // Check Supabase connection using the logged-in user's session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setBackendStatus('offline');
        return;
      }

      // Supabase is reachable
      if (data) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      console.error('Supabase connection error:', error);
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      testBackend();
    };

    const handleOffline = () => {
      setIsOffline(true);
      setBackendStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    testBackend();

    // Check every 30 seconds
    const interval = setInterval(testBackend, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Everything is working
  if (!isOffline && backendStatus === 'online') {
    return null;
  }

  return (
    <div className="bg-accent text-cream text-xs py-2 px-4 flex items-center justify-between shadow-md z-50">

      <div className="flex items-center gap-2">
        <WifiOff
          size={14}
          className="animate-pulse text-primary"
        />

        <span>
          {isOffline
            ? 'No Internet connection. Please check your connection.'
            : backendStatus === 'checking'
              ? 'Checking connection...'
              : 'Unable to connect to Supabase.'}
        </span>
      </div>

      <button
        onClick={testBackend}
        disabled={backendStatus === 'checking'}
        className="flex items-center gap-1 bg-primary hover:bg-olive text-darkText px-3 py-1 rounded-lg text-[10px] font-bold transition-colors"
      >
        <RefreshCw
          size={10}
          className={
            backendStatus === 'checking'
              ? 'animate-spin'
              : ''
          }
        />

        {backendStatus === 'checking'
          ? 'Checking...'
          : 'Retry'}
      </button>

    </div>
  );
}

export default NetworkStatusBanner;