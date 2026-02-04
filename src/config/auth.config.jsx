// ===============================
// AUTH CONFIGURATION
// ===============================

export const authConfig = {
  // -------------------------------
  // BACKEND API
  // -------------------------------
  
 apiBaseUrl: 'http://localhost:5009',

  // -------------------------------
  // GOOGLE SIGN-IN
  // -------------------------------
  google: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  },

  // -------------------------------
  // FACEBOOK LOGIN (UI ONLY)
  // -------------------------------
  facebook: {
    appId: 'YOUR_FACEBOOK_APP_ID',
    version: 'v18.0',
  },

  // -------------------------------
  // STORAGE KEYS
  // -------------------------------
  storage: {
    token: 'token',
    user: 'user',
    theme: 'theme',
  },
};

// ===============================
// HELPERS
// ===============================

export const getApiBaseUrl = () => {
    return 'http://localhost:5009/api/Auth';
};
    

export const getGoogleClientId = () => authConfig.google.clientId;

export const getFacebookAppId = () => authConfig.facebook.appId;
