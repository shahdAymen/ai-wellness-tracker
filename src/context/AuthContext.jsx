import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, setToken, getToken, removeToken } from '../API/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // INIT AUTH (on refresh)
  // ===============================
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

  // ===============================
  // LOGIN
  // ===============================
  const login = async (email, password, isAdmin = false) => {
    const response = isAdmin
      ? await authAPI.adminLogin({ email, password })
      : await authAPI.login({ email, password });

    const userData = {
      email,
      role: response.role,
    };

    setToken(response.token);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ===============================
  // GOOGLE LOGIN
  // ===============================
  const loginWithGoogle = async (idToken) => {
    const response = await authAPI.googleLogin({ idToken });

    const userData = {
      role: response.role,
    };

    setToken(response.token);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ===============================
  // REGISTER
  // ===============================
  const register = async (data) => {
    await authAPI.register({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });

    await login(data.email, data.password);
  };

  // ===============================
  // LOGOUT
  // ===============================
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

// ===============================
// USE AUTH
// ===============================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
export { AuthContext };