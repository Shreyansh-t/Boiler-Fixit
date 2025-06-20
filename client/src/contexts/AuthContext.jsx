import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8001/api/auth/signup', userData);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
      return { 
        success: false, 
        error: err.response?.data?.message || 'An error occurred during signup'
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8001/api/auth/login', credentials);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Invalid email or password'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 