import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authcontext';
import LoginPage from './Components/Authentication/Login';
import NestedComments from './Components/NestedComments/NestedComments';
import { Toaster } from 'react-hot-toast';

// A component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a nice spinner component
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// A component for public routes (like login) that redirects if the user is already logged in
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
  
    if (loading) {
      return <div>Loading...</div>; // Or a nice spinner component
    }
  
    return isAuthenticated ? <Navigate to="/" replace /> : children;
  };

function AppContent() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <NestedComments />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// The main App component wraps everything in the AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;