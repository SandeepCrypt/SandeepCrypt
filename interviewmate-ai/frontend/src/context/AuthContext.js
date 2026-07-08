// ============================================
// INTERVIEWMATE AI - AUTHENTICATION CONTEXT
// ============================================

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';
import { storage } from '../utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
      const savedUser = storage.get(STORAGE_KEYS.USER_DATA);
      
      if (token && savedUser) {
        try {
          // Verify token validity
          const response = await authService.verifyToken();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (err) {
          // Token invalid, try refresh
          await handleTokenRefresh();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleTokenRefresh = async () => {
    try {
      const refreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) throw new Error('No refresh token');
      
      const response = await authService.refreshToken(refreshToken);
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      logout();
    }
  };

  const login = useCallback(async (credentials) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      const { access_token, refresh_token, user: userData } = response.data;
      
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      storage.set(STORAGE_KEYS.USER_DATA, userData);
      
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await authService.register(userData);
      const { access_token, refresh_token, user: newUser } = response.data;
      
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      storage.set(STORAGE_KEYS.USER_DATA, newUser);
      
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_DATA);
      
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      const updatedUser = response.data.user;
      
      storage.set(STORAGE_KEYS.USER_DATA, updatedUser);
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Update failed' 
      };
    }
  }, []);

  const updatePassword = useCallback(async (passwordData) => {
    try {
      await authService.updatePassword(passwordData);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Password update failed' 
      };
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Request failed' 
      };
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      await authService.resetPassword(token, newPassword);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Reset failed' 
      };
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;