// App.jsx
import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import './styles/globals.css';
// Layouts
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/Layout/AdminLayout';

// ===============================
// PUBLIC PAGES
// ===============================
import LandingPage from './pages/public/LandingPage';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import AdminLogin from './pages/public/AdminLogin';

// ===============================
// USER PAGES
// ===============================
import CompleteProfile from './pages/user/CompleteProfile';
import UserDashboard from './pages/user/UserDashboard';
import Protocol from './pages/user/Protocol';
import Tracker from './pages/user/Tracker';
import Analytics from './pages/user/Analytics';
import Restaurants from './pages/user/Restaurants';
import Notifications from './pages/user/Notifications';
import Settings from './pages/user/Settings';
import DeviceSync from './pages/user/DeviceSync';

// ===============================
// ADMIN PAGES
// ===============================
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageRecipes from './pages/admin/ManageRecipes';
import ManageWorkouts from './pages/admin/ManageWorkouts';
import ManageRestaurants from './pages/admin/ManageRestaurants';
import SystemAnalytics from './pages/admin/systemAnalytics';

// ===============================
// ROUTES HANDLER
// ===============================
function AppRoutes() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {/* ---------------- PUBLIC ---------------- */}
      <Route path="/" element={<LandingPage />} />
      
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/user'} replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/user" replace /> : <Register />}
      />
      <Route
        path="/admin/login"
        element={isAuthenticated && isAdmin ? <Navigate to="/admin" replace /> : <AdminLogin />}
      />

      {/* ---------------- USER ---------------- */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="complete-profile" element={<CompleteProfile />} />
        <Route path="protocol" element={<Protocol />} />
        <Route path="tracker" element={<Tracker />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="device-sync" element={<DeviceSync />} />
      </Route>

      {/* ---------------- ADMIN ---------------- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="recipes" element={<ManageRecipes />} />
        <Route path="workouts" element={<ManageWorkouts />} />
        <Route path="restaurants" element={<ManageRestaurants />} />
        <Route path="analytics" element={<SystemAnalytics />} />
      </Route>

      {/* ---------------- FALLBACK ---------------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ===============================
// APP ROOT
// ===============================
export default function App() {
  return <AppRoutes />; // لا يوجد Router هنا
}
