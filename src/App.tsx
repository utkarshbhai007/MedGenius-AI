import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import { AdminRoute } from '@/components/AdminRoute';
import { DidYouKnow } from '@/components/ui/DidYouKnow';
import Layout from '@/components/layout/Layout';
import ScrollToTop from '@/components/ScrollToTop';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import PatientAnalysis from '@/pages/PatientAnalysis';
import DrugDiscovery from '@/pages/DrugDiscovery';
import SideEffects from '@/pages/SideEffects';
import AdminDashboard from '@/pages/AdminDashboard';
import UserManagement from '@/pages/UserManagement';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import PatientDashboard from '@/pages/PatientDashboard';
import AnalysisResults from '@/pages/AnalysisResults';
import DrugRecommendation from './pages/DrugRecommendation';
import Documentation from './pages/Documentation';
import ApiReference from './pages/ApiReference';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';

// Wrapper component to conditionally render DidYouKnow
const DidYouKnowWrapper = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Only show on home page when logged in
  if (!user || location.pathname !== '/home') {
    return null;
  }
  
  return <DidYouKnow />;
};

// Main app content component
const AppContent = () => {
  useSessionTimeout();

  return (
    <>
      <ScrollToTop />
      <Toaster />
      <DidYouKnowWrapper />
      <Routes>
        {/* Public Routes - Accessible to everyone */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Require authentication and use Layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}> {/* Layout wraps these routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient-analysis" element={<PatientAnalysis />} />
            <Route path="/patient/analysis" element={<PatientAnalysis />} />
            <Route path="/patient/analysis/:id" element={<AnalysisResults />} />
            <Route path="/drug-discovery" element={<DrugDiscovery />} />
            <Route path="/side-effects" element={<SideEffects />} />
            <Route path="/drug-recommendation" element={<DrugRecommendation />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/analysis-results" element={<AnalysisResults />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            {/* Documentation Routes inside Layout */}
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/api-reference" element={<ApiReference />} />
            {/* Admin Routes inside Layout */}
            <Route element={<AdminRoute />}> {/* Nested Admin Check */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
            {/* Fallback for not found pages inside Layout */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* Removed standalone Documentation and Admin routes as they are now inside Layout */}

        {/* Fallback for routes outside authentication/layout (e.g., if PrivateRoute fails) */}
        {/* <Route path="*" element={<NotFound />} /> Consider if a non-layout NotFound is needed */}
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
