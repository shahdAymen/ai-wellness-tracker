// ===============================
// AUTH CONFIGURATION
// ===============================

export const authConfig = {
  // -------------------------------
  // BACKEND API
  // -------------------------------
  apiBaseUrl: "https://nondespotic-foreseeable-brynn.ngrok-free.dev/api/Auth",

  // -------------------------------
  // GOOGLE SIGN-IN
  // -------------------------------
google: {
  clientId: "454689813031-e64siip5h5prliemgjmqqg82smj9q870.apps.googleusercontent.com",
},


  // -------------------------------D
  // FACEBOOK LOGIN (UI ONLY)
  // -------------------------------
  facebook: {
    appId: "YOUR_FACEBOOK_APP_ID",
    version: "v18.0",
  },

  // -------------------------------
  // STORAGE KEYS
  // -------------------------------
  storage: {
    token: "token",
    user: "user",
    theme: "theme",
  },
};

// ===============================
// HELPERS
// ===============================

export const getApiBaseUrl = () => authConfig.apiBaseUrl;

export const getGoogleClientId = () => authConfig.google.clientId;

export const getFacebookAppId = () => authConfig.facebook.appId;