import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Shield, Key } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="flex items-center gap-4">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
              {user.displayName || user.email?.split('@')[0] || 'Account'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="rounded-full bg-primary/10 p-1">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigate('/settings')} className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/security')} className="cursor-pointer">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={() => navigate('/login')}
          variant="outline"
          className="gap-2"
        >
          <User className="h-4 w-4" />
          Sign In
        </Button>
      )}
    </div>
  );
};

export default UserMenu;
