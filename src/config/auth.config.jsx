export const authConfig = {
  // BACKEND API 
  apiBaseUrl: "https://vetalityai-production.up.railway.app",

  // GOOGLE SIGN-IN
  google: {
    clientId: "454689813031-e64siip5h5prliemgjmqqg82smj9q870.apps.googleusercontent.com",
  },

  // FACEBOOK LOGIN (UI ONLY)
  facebook: {
    appId: "YOUR_FACEBOOK_APP_ID",
    version: "v18.0",
  },

  // STORAGE KEYS
  storage: {
    token: "token",
    user: "user",
    theme: "theme",
  },
};

// ===============================
// HELPERS (مهم جدًا)
// ===============================

export const getApiBaseUrl = () => authConfig.apiBaseUrl;

export const getGoogleClientId = () => authConfig.google.clientId;

export const getFacebookAppId = () => authConfig.facebook.appId;