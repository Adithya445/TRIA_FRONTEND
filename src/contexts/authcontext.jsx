import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true
});
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
      return { success: false };
    }
  };

  // --- THIS FUNCTION IS NOW CORRECTED ---
  const registerUser = async (name, email, password, avatar) => {
    try {
      // It now correctly sends the avatar in the request body
      const { data } = await api.post('/auth/register', { name, email, password, avatar });
      if (data.success) {
        toast.success("Registration successful! Please check your email for an OTP.");
        return { success: true };
      }
    } catch (error) {
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

