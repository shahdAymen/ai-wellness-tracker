import React, { createContext, useContext, useState, useEffect } from 'react';

// إنشاء السياق
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // استرجاع المستخدم من localStorage عند بداية التطبيق
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // تسجيل الدخول
  const login = async (email, password, isAdminLogin = false) => {
    // بيانات وهمية للمثال
    const mockUser = isAdminLogin
      ? { id: 'admin-1', name: 'Admin', email, role: 'admin' }
      : {
          id: 'user-1',
          name: email.split('@')[0],
          email,
          role: 'user',
          age: 28,
          gender: 'Male',
          weight: 75,
          height: 175,
          goals: 'Weight Loss',
          activityLevel: 'Moderate',
        };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  // تسجيل مستخدم جديد
  const register = async (data) => {
    const newUser = {
      id: 'user-' + Date.now(),
      name: data.name,
      email: data.email,
      role: 'user',
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // تسجيل الخروج
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // تحديث بيانات المستخدم
  const updateProfile = (data) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// hook للوصول للسياق بسهولة
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
