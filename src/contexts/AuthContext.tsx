import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { auth, db } from '@/config/firebase';

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  role?: 'patient' | 'doctor' | 'researcher' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    console.log("AuthContext useEffect running");
    try {
      const storedUser = localStorage.getItem('user');
      console.log("Stored user from localStorage:", storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user:", parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }

    // Listen for storage events (in case user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      console.log("Storage event detected:", e.key, e.newValue);
      if (e.key === 'user') {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Call to the backend API for authentication
      const response = await fetch('https://medgenius-ai-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const userData = await response.json();
      
      // Create user object with appropriate structure
      const authenticatedUser: User = {
        uid: userData.id || userData._id,
        email: userData.email,
        displayName: userData.name,
        role: userData.role
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      setUser(authenticatedUser);
      setError(null);
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to log in');
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err instanceof Error ? err.message : 'Invalid credentials or server error',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Call to the backend API for registration
      const response = await fetch('https://medgenius-ai-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const userData = await response.json();
      
      // Create user object with appropriate structure
      const newUser: User = {
        uid: userData.id || userData._id,
        email: userData.email,
        displayName: userData.name,
        role: userData.role
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      setError(null);
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to register');
      
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err instanceof Error ? err.message : 'Failed to create account',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Call to the backend API for Google authentication
      const response = await fetch('https://medgenius-ai-production.up.railway.app/api/auth/google', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google sign-in failed');
      }
      
      const userData = await response.json();
      
      // Create user object with appropriate structure
      const authenticatedUser: User = {
        uid: userData.id || userData._id,
        email: userData.email,
        displayName: userData.name,
        role: userData.role
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      setUser(authenticatedUser);
      setError(null);
      
      toast({
        title: "Success",
        description: "Signed in with Google successfully",
      });
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      
      toast({
        variant: "destructive",
        title: "Google Sign-in Failed",
        description: err instanceof Error ? err.message : 'Failed to authenticate with Google',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear user data
    setUser(null);
    localStorage.removeItem('user');
    
    // Clear all stored application data
    localStorage.removeItem('patientAnalysis');
    localStorage.removeItem('recommendations');
    localStorage.removeItem('analysisResults');
    localStorage.removeItem('lastActivityTime');
    
    // Redirect to login page using window.location
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}