export const authConfig = {
  // BACKEND API
  apiBaseUrl: "https://vetalityai.onrender.com/api",
  apiRootUrl: "https://vetalityai.onrender.com/api",

  // GOOGLE SIGN-IN (NEW CLIENT ID)
  google: {
    clientId:
      "900871545340-3450fr1jfloec2m9ur3kumef4e0dd5tq.apps.googleusercontent.com",
  },

  // FACEBOOK LOGIN (NOT READY YET)
  facebook: {
    appId: "", // سيبيه فاضي أو حطيه بعدين
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
// HELPERS
// ===============================

export const getApiBaseUrl = () => authConfig.apiBaseUrl;

export const getGoogleClientId = () => authConfig.google.clientId;

export const getFacebookAppId = () => authConfig.facebook.appId;

export const getApiRootUrl = () => authConfig.apiRootUrl;