// ============================================
// INTERVIEWMATE AI - INTERVIEW SERVICE
// ============================================

import { api } from '../utils/api';

export const interviewService = {
  // Start new interview session
  startSession: (config) => api.post('/interview/start', config),
  
  // Get next question
  getNextQuestion: (sessionId) => api.get(`/interview/${sessionId}/question`),
  
  // Submit response for current question
  submitResponse: (data) => {
    const formData = new FormData();
    formData.append('session_id', data.sessionId);
    formData.append('question_id', data.questionId);
    formData.append('transcript', data.transcript || '');
    
    if (data.audioBlob) {
      formData.append('audio', data.audioBlob, 'response.webm');
    }
    
    if (data.facialEmotions) {
      formData.append('facial_emotions', JSON.stringify(data.facialEmotions));
    }
    
    if (data.speechEmotions) {
      formData.append('speech_emotions', JSON.stringify(data.speechEmotions));
    }
    
    return api.post('/interview/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // End interview session
  endSession: (sessionId) => api.post(`/interview/${sessionId}/end`),
  
  // Abort interview session
  abortSession: (sessionId) => api.post(`/interview/${sessionId}/abort`),
  
  // Get session status
  getSessionStatus: (sessionId) => api.get(`/interview/${sessionId}/status`),
  
  // Get real-time emotion data (WebSocket connection helper)
  connectEmotionStream: (sessionId) => {
    const wsUrl = `${process.env.REACT_APP_WS_URL}/interview/${sessionId}/emotions`;
    return new WebSocket(wsUrl);
  },
  
  // Get interview history
  getHistory: (page = 1, limit = 10) => api.get(`/interview/history?page=${page}&limit=${limit}`),
  
  // Get session details
  getSessionDetails: (sessionId) => api.get(`/interview/${sessionId}`)
};