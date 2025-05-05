import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function AdminRoute() {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated and has admin role, render the children
  return <Outlet />;
} 