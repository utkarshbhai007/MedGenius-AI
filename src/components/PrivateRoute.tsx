import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log("PrivateRoute rendering", { user, path: location.pathname });

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("User is not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  console.log("User is authenticated, rendering protected route");
  return <Outlet />;
};

export default PrivateRoute; 