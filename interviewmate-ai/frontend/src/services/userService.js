// ============================================
// INTERVIEWMATE AI - USER SERVICE
// ============================================

import { api } from '../utils/api';

export const userService = {
  // Get user dashboard data
  getDashboard: () => api.get('/user/dashboard'),
  
  // Get user progress
  getProgress: () => api.get('/user/progress'),
  
  // Get recent sessions
  getRecentSessions: (limit = 5) => api.get(`/user/sessions/recent?limit=${limit}`),
  
  // Get achievements/badges
  getAchievements: () => api.get('/user/achievements'),
  
  // Update user settings
  updateSettings: (settings) => api.put('/user/settings', settings),
  
  // Get notification preferences
  getNotificationSettings: () => api.get('/user/notifications'),
  
  // Update notification preferences
  updateNotificationSettings: (settings) => api.put('/user/notifications', settings),
  
  // Delete account
  deleteAccount: () => api.delete('/user/account'),
  
  // Get activity log
  getActivityLog: (page = 1) => api.get(`/user/activity?page=${page}`)
};