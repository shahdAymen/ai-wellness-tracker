import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getGoogleClientId } from '../../config/auth.config';

export function SocialLogin({ redirectPath = '/app' }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [googleReady, setGoogleReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ===============================
  // GOOGLE INIT
  // ===============================
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      if (window.google) initializeGoogle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = initializeGoogle;
    script.onerror = () =>
      console.error('Failed to load Google Sign-In script');

    document.body.appendChild(script);
  }, []);

  const initializeGoogle = () => {
    try {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: getGoogleClientId(),
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        setGoogleReady(true);
      }
    } catch (error) {
      console.error('Google init error:', error);
    }
  };

  // ===============================
  // GOOGLE RESPONSE
  // ===============================
  const handleGoogleResponse = async (response) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await loginWithGoogle(response.credential);
      navigate(redirectPath);
    } catch (error) {
      console.error('Google login failed:', error);
      alert(error.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ===============================
  // CLICK LOGIN
  // ===============================
  const handleGoogleLogin = () => {
    if (isLoading) return;

    if (!googleReady || !window.google) {
      alert('Google is not ready yet');
      return;
    }

    window.google.accounts.id.prompt();
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* GOOGLE ONLY */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={!googleReady || isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1"
            />
            <path
              fill="#34A853"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92"
            />
          </svg>

          <span className="text-sm">
            {isLoading ? 'Loading...' : 'Continue with Google'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default SocialLogin;