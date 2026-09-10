import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export function useAndroidBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let backListener = null;

    const setupListener = async () => {
      backListener = await App.addListener('backButton', ({ canGoBack }) => {
        const path = location.pathname;
        
        // Root pages where pressing back will minimize/exit the app
        if (path === '/' || path === '/dashboard' || path === '/login') {
          App.exitApp();
        } else {
          // If on a sub-route or detail page, navigate back to previous screen
          navigate(-1);
        }
      });
    };

    setupListener();

    return () => {
      if (backListener && backListener.remove) {
        backListener.remove();
      }
    };
  }, [navigate, location]);
}

export default useAndroidBackButton;
