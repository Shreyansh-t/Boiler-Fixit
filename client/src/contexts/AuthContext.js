import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const token = localStorage.getItem('token');
    if (token) {
      // For now, just set authenticated to true if token exists
      // In production, you'd validate the token with your backend
      setIsAuthenticated(true);
      setUser({ token }); // Mock user object
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Mock API call - replace with real API call later
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });
      // const data = await response.json();
      
      // Mock successful login
      const mockToken = 'mock-jwt-token-' + Math.random();
      localStorage.setItem('token', mockToken);
      setIsAuthenticated(true);
      setUser({ token: mockToken });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      // Mock API call - replace with real API call later
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();
      
      // Mock successful signup
      const mockToken = 'mock-jwt-token-' + Math.random();
      localStorage.setItem('token', mockToken);
      setIsAuthenticated(true);
      setUser({ token: mockToken });
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 