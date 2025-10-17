import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create an axios instance for API calls
const api = axios.create({
  baseURL: '/api/v1', // Your backend's API prefix
  withCredentials: true // Important for sending cookies
});

// Export the api instance so other components can use it
export { api };

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already logged in when the app loads
    const checkLoggedIn = async () => {
      try {
        const { data } = await api.get('/auth/me'); // Endpoint to get current user
        if (data.success) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed!');
      return { success: false, message: error.response?.data?.message };
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      if (data.success) {
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed!');
      return { success: false, message: error.response?.data?.message };
    }
  };

  const logoutUser = async () => {
    try {
      // Your backend uses a POST route for logout
      await api.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
