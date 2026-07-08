// ============================================
// INTERVIEWMATE AI - QUESTION SERVICE
// ============================================

import { api } from '../utils/api';

export const questionService = {
  // Get all job categories
  getCategories: () => api.get('/categories'),
  
  // Get category details
  getCategoryById: (id) => api.get(`/categories/${id}`),
  
  // Get questions by category
  getQuestionsByCategory: (categoryId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/categories/${categoryId}/questions?${queryParams}`);
  },
  
  // Get all companies
  getCompanies: () => api.get('/companies'),
  
  // Get company details
  getCompanyById: (id) => api.get(`/companies/${id}`),
  
  // Get company-specific questions
  getCompanyQuestions: (companyId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/companies/${companyId}/questions?${queryParams}`);
  },
  
  // Get STAR model answer for a question
  getStarAnswer: (questionId) => api.get(`/questions/${questionId}/star-answer`),
  
  // Generate AI questions based on resume
  generateQuestions: (data) => api.post('/questions/generate', data),
  
  // Get question by ID
  getQuestionById: (id) => api.get(`/questions/${id}`)
};