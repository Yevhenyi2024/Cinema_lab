import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute({ children, allowedRoles = ['user', 'admin'] }) {
  const { currentUser, isAuthenticated, loadingInitial } = useAuth();
  const location = useLocation();

  if (loadingInitial) {
    return <LoadingSpinner message="Перевірка авторизації..." />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0) {
    const userRole = currentUser?.role;
    if (!allowedRoles.includes(userRole)) {
      console.warn(`Роль "${userRole}" не має доступу до маршруту`);
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;