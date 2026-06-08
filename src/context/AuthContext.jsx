import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI, clearAuthSession, getAuthSession, setAuthSession, setStoredUser, userAPI } from '../services/api';

const AuthContext = createContext(null);

function normalizeRoles(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function mergeUser(profile, sessionUser, roles) {
  const mergedRoles = normalizeRoles(roles?.length ? roles : sessionUser?.roles);

  return {
    ...sessionUser,
    ...profile,
    name: profile?.fullName || sessionUser?.fullName || sessionUser?.name || profile?.email,
    fullName: profile?.fullName || sessionUser?.fullName || sessionUser?.name,
    email: profile?.email || sessionUser?.email,
    roles: mergedRoles,
  };
}

function profileIsComplete(profile) {
  return Boolean(
    profile?.gender &&
      profile?.birthDate &&
      profile?.height &&
      profile?.weight &&
      profile?.activityLevel &&
      profile?.goal
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrateUser = useCallback(async (fallbackAuthPayload) => {
    const session = getAuthSession();
    const roles = normalizeRoles(fallbackAuthPayload?.roles || session.roles);

    try {
      const profile = await userAPI.getMe();
      const merged = mergeUser(profile, fallbackAuthPayload || session.user, roles);
      setStoredUser(merged);
      setUser(merged);
      return merged;
    } catch {
      const fallback = mergeUser(fallbackAuthPayload, session.user, roles);
      if (fallback?.email) {
        setStoredUser(fallback);
        setUser(fallback);
        return fallback;
      }
      throw new Error('Unable to restore session.');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const params = new URLSearchParams(window.location.search);
      const queryToken = params.get('token') || params.get('Token') || params.get('accessToken') || params.get('access_token');
      const queryRefreshToken = params.get('refreshToken') || params.get('refresh_token') || params.get('Refreshtoken');

      if (queryToken && queryRefreshToken) {
        const id = params.get('id') || params.get('Id') || params.get('userId') || params.get('UserId');
        const email = params.get('email') || params.get('Email');
        const fullName = params.get('fullName') || params.get('FullName') || params.get('name') || params.get('Name') || params.get('fullname');
        const expiresIn = params.get('expiresIn') || params.get('expires_in') || params.get('ExpiresIn') || 3600;

        const rolesStr = params.get('roles') || params.get('Roles') || params.get('role') || params.get('Role');
        let roles = [];
        if (rolesStr) {
          try {
            roles = JSON.parse(rolesStr);
          } catch {
            roles = [rolesStr];
          }
        }

        const payload = {
          token: queryToken,
          refreshToken: queryRefreshToken,
          id,
          email,
          fullName,
          expiresIn,
          roles: roles.length ? roles : ['User'],
        };

        setAuthSession(payload);

        // Remove parameters from URL
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);

        try {
          const restored = await hydrateUser(payload);
          if (mounted) setUser(restored);
        } catch (err) {
          console.error('Failed to restore user session from URL parameters:', err);
        } finally {
          if (mounted) setLoading(false);
        }
        return;
      }

      const session = getAuthSession();

      if (!session.token) {
        clearAuthSession();
        if (mounted) setLoading(false);
        return;
      }

      try {
        const restored = await hydrateUser();
        if (mounted) setUser(restored);
      } catch {
        clearAuthSession();
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    restoreSession();

    const onExpired = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('vitalityai:auth-expired', onExpired);
    return () => {
      mounted = false;
      window.removeEventListener('vitalityai:auth-expired', onExpired);
    };
  }, [hydrateUser]);

  const login = useCallback(
    async (email, password) => {
      const authPayload = await authAPI.login({ email, password });
      setAuthSession(authPayload);
      return hydrateUser(authPayload);
    },
    [hydrateUser]
  );

  const register = useCallback(
    async ({ fullName, email, password }) => {
      const authPayload = await authAPI.register({ fullName, email, password });
      setAuthSession(authPayload);
      return hydrateUser(authPayload);
    },
    [hydrateUser]
  );

  const refreshMe = useCallback(() => hydrateUser(), [hydrateUser]);

  const logout = useCallback(async () => {
    const { token, refreshToken } = getAuthSession();
    try {
      if (token && refreshToken) {
        await authAPI.revokeRefreshToken({ token, refreshToken });
      }
    } catch {
      // Logout should always clear local state even when revoke fails.
    } finally {
      clearAuthSession();
      setUser(null);
    }
  }, []);

  const value = useMemo(() => {
    const roles = normalizeRoles(user?.roles);
    const isAdmin = roles.some((role) => role?.toLowerCase?.() === 'admin');
    return {
      user,
      roles,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin,
      hasCompletedProfile: profileIsComplete(user),
      login,
      register,
      logout,
      refreshMe,
    };
  }, [user, loading, login, register, logout, refreshMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

export { AuthContext };
