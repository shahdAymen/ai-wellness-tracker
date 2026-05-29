const ACCESS_TOKEN_KEY = 'vitalityai.accessToken';
const REFRESH_TOKEN_KEY = 'vitalityai.refreshToken';
const ROLES_KEY = 'vitalityai.roles';
const USER_KEY = 'vitalityai.user';
const EXPIRES_AT_KEY = 'vitalityai.expiresAt';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredRoles() {
  try {
    return JSON.parse(localStorage.getItem(ROLES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function getAuthTokens() {
  return {
    token: getAccessToken(),
    refreshToken: getRefreshToken(),
  };
}

export function getAuthSession() {
  return {
    token: getAccessToken(),
    refreshToken: getRefreshToken(),
    roles: getStoredRoles(),
    user: getStoredUser(),
    expiresAt: localStorage.getItem(EXPIRES_AT_KEY),
  };
}

export function setAuthSession(authPayload) {
  if (!authPayload) return;

  const roles = Array.isArray(authPayload.roles)
    ? authPayload.roles
    : authPayload.role
      ? [authPayload.role]
      : getStoredRoles();

  const user = {
    id: authPayload.id,
    fullName: authPayload.fullName,
    name: authPayload.fullName,
    email: authPayload.email,
    roles,
  };

  if (authPayload.token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, authPayload.token);
  }

  if (authPayload.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, authPayload.refreshToken);
  }

  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  if (authPayload.expiresIn) {
    const expiresAt = Date.now() + Number(authPayload.expiresIn) * 1000;
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  }
}

export function setStoredUser(user) {
  if (!user) return;
  const roles = user.roles || getStoredRoles();
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, roles }));
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLES_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
