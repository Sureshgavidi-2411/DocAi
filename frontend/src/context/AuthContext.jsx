import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('docintel_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('docintel_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Synchronize and verify current user with backend on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('docintel_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data?.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('docintel_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Failed to verify existing session token:', err.userMessage || err.message);
          // Only clear if unauthenticated
          if (err.response?.status === 401) {
            localStorage.removeItem('docintel_token');
            localStorage.removeItem('docintel_user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('docintel_token', receivedToken);
    localStorage.setItem('docintel_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await authAPI.register({ name, email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('docintel_token', receivedToken);
    localStorage.setItem('docintel_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return response.data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('docintel_token');
    localStorage.removeItem('docintel_user');
    setToken(null);
    setUser(null);
  }, []);

  const getCurrentUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.data?.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('docintel_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
    return user;
  };

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
