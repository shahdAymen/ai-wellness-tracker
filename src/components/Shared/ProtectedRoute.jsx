import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // WAIT AUTH INIT
  if (loading) return null;

  // NOT LOGGED IN
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ADMIN ONLY ROUTE
  if (requireAdmin && !isAdmin) return <Navigate to="/user" replace />;

  return children;
}
export { ProtectedRoute };