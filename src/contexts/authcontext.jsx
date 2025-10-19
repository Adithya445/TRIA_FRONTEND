import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// This line reads the variable from your .env.local file.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  // And this line uses it to configure Axios.
  baseURL: `${API_BASE_URL}/api/v1`, 
  withCredentials: true
});

// --- THIS IS THE FIX ---
// Export the 'api' instance so other components like NestedComments can use it.
export { api };

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // This is an expected error if the user isn't logged in.
        console.log("User not logged in.");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        // This is crucial: it ensures the loading screen always disappears.
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
      return { success: false };
    }
  };

  const registerUser = async (name, email, password, avatar, isAdminRegister) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, avatar, isAdminRegister });
      if (data.success) {
        toast.success("Registration successful! Please check your email for an OTP.");
        return { success: true };
      }
    } catch (error) {
      // ADD THIS LINE TO SEE THE FULL ERROR IN THE BROWSER CONSOLE
      console.error("💥 REGISTRATION CATCH BLOCK ERROR:", error);
      toast.error(error.response?.data?.message || 'Registration failed!');
      return { success: false };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
        const { data } = await api.post('/auth/verify-otp', { email, otp });
        if (data.success) {
          return { success: true };
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'OTP verification failed!');
        return { success: false };
    }
  };

  const logoutUser = async () => {
    try {
      // Use POST to match the backend route
      await api.post('/auth/logout'); 
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, loginUser, registerUser, logoutUser, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

