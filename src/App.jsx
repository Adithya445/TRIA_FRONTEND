import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authcontext';
import LoginPage from './Components/Authentication/Login';
import OtpVerification from './Components/Authentication/OtpVerification'; // Import the new component
import NestedComments from './Components/NestedComments/NestedComments';
import { Toaster } from 'react-hot-toast';

// ProtectedRoute and PublicRoute remain the same
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function AppContent() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        
        {/* --- NEW ROUTE FOR OTP VERIFICATION --- */}
        <Route path="/verify-otp" element={<PublicRoute><OtpVerification /></PublicRoute>} />

        <Route path="/" element={<ProtectedRoute><NestedComments /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
