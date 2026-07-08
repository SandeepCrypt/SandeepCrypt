// ============================================
// INTERVIEWMATE AI - UPLOAD SERVICE
// ============================================

import { api } from '../utils/api';
import { MAX_FILE_SIZE, SUPPORTED_RESUME_TYPES } from '../utils/constants';

export const uploadService = {
  // Upload resume
  uploadResume: (file, onProgress) => {
    validateFile(file);
    return api.upload('/upload/resume', file, onProgress);
  },
  
  // Upload profile picture
  uploadAvatar: (file, onProgress) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Image size must be less than 2MB');
    }
    return api.upload('/upload/avatar', file, onProgress);
  },
  
  // Get upload status
  getUploadStatus: (uploadId) => api.get(`/upload/status/${uploadId}`),
  
  // Delete uploaded file
  deleteFile: (filePath) => api.delete('/upload/file', { data: { path: filePath } })
};

// File validation helper
const validateFile = (file) => {
  if (!file) throw new Error('No file provided');
  
  if (!SUPPORTED_RESUME_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Please upload PDF or DOCX');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
};