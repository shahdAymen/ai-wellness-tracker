import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from "../API/auth.api";
import { setToken, getToken, removeToken } from "../API/core/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // INIT
  useEffect(() => {
    const token = getToken();
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      removeToken();
      localStorage.removeItem('user');
    }

    setLoading(false);
  }, []);

  // ======================
  // LOGIN
  // ======================
  const login = async (email, password, isAdmin = false) => {
    const response = isAdmin
      ? await authAPI.adminLogin({ email, password })
      : await authAPI.login({ email, password });

    const userData = {
      name: response.name || email,
      email,
      role: response.role,
    };

    setToken(response.token);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ======================
  // GOOGLE LOGIN
  // ======================
  const loginWithGoogle = async (credential) => {
    const response = await authAPI.googleLogin({ credential });

    const userData = {
      name: response.name,
      email: response.email,
      role: response.role,
    };

    setToken(response.token);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ======================
  // REGISTER (FIXED)
  // ======================
  const register = async (data) => {
    try {
      await authAPI.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword, // ✅ FIXED
      });

      // login after success
      await login(data.email, data.password, false);

    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// HOOK
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export { AuthContext };