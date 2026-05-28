import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getGoogleClientId, getFacebookAppId } from '../../config/auth.config';

export default function SocialLogin({ redirectPath = '/app' }) {
  const { loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();

  const [googleReady, setGoogleReady] = useState(false);
  const [fbReady, setFbReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const googleInit = useRef(false);
  const fbInit = useRef(false);

  // ================= GOOGLE =================
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      if (window.google && !googleInit.current) {
        window.google.accounts.id.initialize({
          client_id: getGoogleClientId(),
          callback: async (res) => {
            try {
              setLoading(true);
              await loginWithGoogle(res.credential);
              navigate(redirectPath);
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          },
        });

        googleInit.current = true;
        setGoogleReady(true);
      }
    };

    document.body.appendChild(script);
  }, []);

  const handleGoogleLogin = () => {
    if (!googleReady) return;
    window.google.accounts.id.prompt();
  };

  // ================= FACEBOOK =================
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: getFacebookAppId(),
        cookie: true,
        version: 'v18.0',
      });

      fbInit.current = true;
      setFbReady(true);
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.onload = () => window.fbAsyncInit();
    document.body.appendChild(script);
  }, []);

  const handleFacebookLogin = () => {
    if (!fbReady) return;

    window.FB.login(async (res) => {
      if (res.authResponse) {
        setLoading(true);
        try {
          await loginWithFacebook(res.authResponse.accessToken);
          navigate(redirectPath);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    }, { scope: 'email,public_profile' });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={handleGoogleLogin}
        disabled={!googleReady || loading}
        className="p-2 border rounded"
      >
        Google
      </button>

      <button
        onClick={handleFacebookLogin}
        disabled={!fbReady || loading}
        className="p-2 border rounded"
      >
        Facebook
      </button>
    </div>
  );
}