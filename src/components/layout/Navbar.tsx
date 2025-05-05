import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Menu, LayoutDashboard, Settings } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show navbar on login page
  if (location.pathname === '/' || location.pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={user ? "/home" : "/"} className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-gray-900">Med</span>
                <span className="text-blue-600">Genius</span>
                <span className="text-gray-900">AI</span>
              </h1>
            </Link>

            {user && (
              <div className="hidden sm:flex sm:ml-8 sm:space-x-4">
                <Link
                  to="/home"
                  className="text-blue-600 hover:text-white hover:bg-blue-600 inline-flex items-center px-4 py-2 text-base font-medium transition-colors rounded-lg border-2 border-blue-600"
                >
                  Home
                </Link>
                <Link
                  to="/patient-analysis"
                  className="text-blue-600 hover:text-white hover:bg-blue-600 inline-flex items-center px-4 py-2 text-base font-medium transition-colors rounded-lg border-2 border-blue-600"
                >
                  Patient Analysis
                </Link>
                <Link
                  to="/drug-recommendation"
                  className="text-blue-600 hover:text-white hover:bg-blue-600 inline-flex items-center px-4 py-2 text-base font-medium transition-colors rounded-lg border-2 border-blue-600"
                >
                  Drug Recommendation
                </Link>
                <Link
                  to="/drug-discovery"
                  className="text-blue-600 hover:text-white hover:bg-blue-600 inline-flex items-center px-4 py-2 text-base font-medium transition-colors rounded-lg border-2 border-blue-600"
                >
                  Drug Discovery
                </Link>
                <Link
                  to="/side-effects"
                  className="text-blue-600 hover:text-white hover:bg-blue-600 inline-flex items-center px-4 py-2 text-base font-medium transition-colors rounded-lg border-2 border-blue-600"
                >
                  Side Effects
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full border-2 border-blue-600 hover:bg-blue-50">
                    <User className="h-6 w-6 text-blue-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700 focus:text-red-700 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <Button variant="ghost" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
