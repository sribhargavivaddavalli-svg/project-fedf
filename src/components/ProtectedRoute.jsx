import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (role && currentUser.role !== role) {
    if (currentUser.role === 'admin') return <Navigate to="/admin" />;
    if (currentUser.role === 'citizen') return <Navigate to="/dashboard" />;
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;