// ============================================
// INTERVIEWMATE AI - API CLIENT
// ============================================

import axios from 'axios';
import { API_BASE_URL, HTTP_STATUS, ERROR_MESSAGES, STORAGE_KEYS } from './constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });
        
        const { access_token } = response.data;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // GET request
  get: (url, config = {}) => apiClient.get(url, config),
  
  // POST request
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  
  // PUT request
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  // PATCH request
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  
  // Upload file
  upload: (url, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress?.(progress);
      }
    });
  }
};

// Error handler
export const handleApiError = (error) => {
  if (!error.response) {
    return { message: ERROR_MESSAGES.NETWORK_ERROR, status: 0 };
  }

  const { status, data } = error.response;
  
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      return { message: ERROR_MESSAGES.UNAUTHORIZED, status };
    case HTTP_STATUS.SERVER_ERROR:
      return { message: ERROR_MESSAGES.SERVER_ERROR, status };
    default:
      return { 
        message: data?.message || data?.error || 'An error occurred', 
        status,
        errors: data?.errors 
      };
  }
};

export default apiClient;