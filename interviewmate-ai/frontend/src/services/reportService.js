// ============================================
// INTERVIEWMATE AI - REPORT SERVICE
// ============================================

import { api } from '../utils/api';

export const reportService = {
  // Get report for a session
  getReport: (sessionId) => api.get(`/reports/${sessionId}`),
  
  // Get confidence score breakdown
  getScoreBreakdown: (sessionId) => api.get(`/reports/${sessionId}/breakdown`),
  
  // Get emotion timeline data
  getEmotionTimeline: (sessionId) => api.get(`/reports/${sessionId}/emotions`),
  
  // Get improvement tips
  getImprovementTips: (sessionId) => api.get(`/reports/${sessionId}/tips`),
  
  // Export report as PDF
  exportPdf: (sessionId) => api.get(`/reports/${sessionId}/export`, {
    responseType: 'blob'
  }),
  
  // Get all reports for user
  getAllReports: (page = 1, limit = 10) => 
    api.get(`/reports?page=${page}&limit=${limit}`),
  
  // Compare multiple sessions
  compareSessions: (sessionIds) => api.post('/reports/compare', { session_ids: sessionIds }),
  
  // Get skill radar data
  getSkillRadar: (sessionId) => api.get(`/reports/${sessionId}/skills`)
};