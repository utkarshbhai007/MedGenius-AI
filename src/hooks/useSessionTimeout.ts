import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useSessionTimeout = () => {
  const { logout } = useAuth();

  const clearAllStoredData = useCallback(() => {
    // Keys to preserve (only auth-related)
    const preserveKeys = ['auth_token', 'refresh_token', 'user_id'];
    
    // Clear localStorage except preserved keys
    Object.keys(localStorage).forEach(key => {
      if (!preserveKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Clear all sessionStorage
    sessionStorage.clear();

    // Clear any additional data stores
    const keysToRemove = [
      'patientAnalysis',
      'drugRecommendations',
      'sideEffects',
      'searchHistory',
      'tempData',
      'cachedResponses',
      'userPreferences',
      'analysisResults',
      'lastSearch',
      'recentActivity'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }, []);

  const handleTimeout = useCallback(() => {
    clearAllStoredData();
    logout();
  }, [logout, clearAllStoredData]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastActivity = Date.now();

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleTimeout, TIMEOUT_DURATION);
      lastActivity = Date.now();
    };

    // Clear data immediately on mount
    clearAllStoredData();

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastActivity >= TIMEOUT_DURATION) {
        handleTimeout();
      }
    };

    // Track user activity
    const updateActivity = () => {
      lastActivity = Date.now();
      resetTimeout();
    };

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearAllStoredData();
      } else {
        checkInactivity();
      }
    };

    // Handle page unload
    const handleUnload = () => {
      clearAllStoredData();
    };

    // Set up event listeners
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus'
    ];

    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('unload', handleUnload);

    // Initial timeout
    resetTimeout();

    // Periodic check for inactivity
    const inactivityCheck = setInterval(checkInactivity, 60000); // Check every minute

    return () => {
      clearTimeout(timeoutId);
      clearInterval(inactivityCheck);
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('unload', handleUnload);
      clearAllStoredData();
    };
  }, [handleTimeout, clearAllStoredData]);
};

export default useSessionTimeout; 