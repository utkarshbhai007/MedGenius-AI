import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const PublicRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("PublicRoute rendering", { user, path: location.pathname });

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // If the user is already authenticated, redirect them to the home page
  if (user) {
    console.log("User is authenticated, redirecting to /home");
    return <Navigate to="/home" replace />;
  }

  // Render child routes for unauthenticated users
  console.log("User is not authenticated, rendering public route");
  return <Outlet />;
};

export default PublicRoute; 