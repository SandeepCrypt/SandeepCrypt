// ============================================
// INTERVIEWMATE AI - AUTHENTICATION SERVICE
// ============================================

import { api } from '../utils/api';

export const authService = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Logout user
  logout: () => api.post('/auth/logout'),
  
  // Refresh access token
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
  
  // Verify current token
  verifyToken: () => api.get('/auth/verify'),
  
  // Get current user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update user profile
  updateProfile: (data) => api.put('/auth/profile', data),
  
  // Update password
  updatePassword: (data) => api.put('/auth/password', data),
  
  // Forgot password - send reset email
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password with token
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', {
    token,
    new_password: newPassword
  }),
  
  // Upload profile picture
  uploadAvatar: (file, onProgress) => api.upload('/auth/avatar', file, onProgress)
};