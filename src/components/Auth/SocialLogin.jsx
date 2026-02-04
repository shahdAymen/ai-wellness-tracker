import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getGoogleClientId, getFacebookAppId } from '../../config/auth.config';

export function SocialLogin({ redirectPath = '/app' }) {
  const { loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();
  const [googleReady, setGoogleReady] = useState(false);
  const [fbReady, setFbReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      if (window.google) initializeGoogle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = initializeGoogle;
    script.onerror = () => console.error('Failed to load Google Sign-In script');

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
      console.error('Failed to initialize Google Sign-In:', error);
    }
  };

  // Initialize Facebook SDK
  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      if (window.FB) setFbReady(true);
      return;
    }

    window.fbAsyncInit = function () {
      if (window.FB) {
        try {
          window.FB.init({
            appId: getFacebookAppId(),
            cookie: true,
            xfbml: true,
            version: 'v18.0',
          });
          setFbReady(true);
        } catch (error) {
          console.error('Failed to initialize Facebook SDK:', error);
        }
      }
    };

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.onerror = () => console.error('Failed to load Facebook SDK');

    document.body.appendChild(script);
  }, []);

  const handleGoogleResponse = async (response) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await loginWithGoogle(response.credential);
      navigate(redirectPath);
    } catch (error) {
      console.error('Google login failed:', error);
      alert(error.message || 'Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (isLoading) return;

    if (!googleReady || !window.google) {
      alert('Google Sign-In is not ready yet. Please wait a moment and try again.');
      return;
    }

    try {
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Failed to show Google Sign-In:', error);
      alert('Failed to show Google Sign-In. Please try again.');
    }
  };

  const handleFacebookLogin = () => {
    if (isLoading) return;

    if (!fbReady || !window.FB) {
      alert('Facebook Login is not ready yet. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);
    try {
      window.FB.login(
        (response) => {
          if (response.authResponse) {
            loginWithFacebook(response.authResponse.accessToken)
              .then(() => navigate(redirectPath))
              .catch((error) => {
                console.error('Facebook login failed:', error);
                alert(error.message || 'Facebook login failed. Please try again.');
              })
              .finally(() => setIsLoading(false));
          } else {
            setIsLoading(false);
          }
        },
        { scope: 'public_profile,email' }
      );
    } catch (error) {
      console.error('Failed to initiate Facebook login:', error);
      alert('Failed to initiate Facebook login. Please try again.');
      setIsLoading(false);
    }
  };

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

      <div className="grid grid-cols-2 gap-3">
        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={!googleReady || isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-sm">{isLoading ? 'Loading...' : 'Google'}</span>
        </button>

        {/* Facebook Login Button */}
        <button
          type="button"
          onClick={handleFacebookLogin}
          disabled={!fbReady || isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-sm">{isLoading ? 'Loading...' : 'Facebook'}</span>
        </button>
      </div>
    </div>
  );
}
export default SocialLogin;