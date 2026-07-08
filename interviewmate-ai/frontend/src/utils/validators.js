// ============================================
// INTERVIEWMATE AI - VALIDATION UTILITIES
// ============================================

import { isValidEmail, getPasswordStrength } from './helpers';
import { MAX_FILE_SIZE, SUPPORTED_RESUME_TYPES } from './constants';

// Validation rules
export const validators = {
  required: (value) => ({
    valid: !!value && value.toString().trim().length > 0,
    message: 'This field is required'
  }),

  email: (value) => ({
    valid: isValidEmail(value),
    message: 'Please enter a valid email address'
  }),

  minLength: (value, min) => ({
    valid: value && value.length >= min,
    message: `Minimum ${min} characters required`
  }),

  maxLength: (value, max) => ({
    valid: !value || value.length <= max,
    message: `Maximum ${max} characters allowed`
  }),

  password: (value) => {
    const strength = getPasswordStrength(value);
    return {
      valid: strength.score >= 3,
      message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
    };
  },

  confirmPassword: (value, password) => ({
    valid: value === password,
    message: 'Passwords do not match'
  }),

  phone: (value) => ({
    valid: /^[\d\s\-\+\(\)]{10,}$/.test(value),
    message: 'Please enter a valid phone number'
  }),

  url: (value) => ({
    valid: !value || /^https?:\/\/.+/.test(value),
    message: 'Please enter a valid URL'
  }),

  fileType: (file) => ({
    valid: !file || SUPPORTED_RESUME_TYPES.includes(file.type),
    message: 'Invalid file type. Please upload PDF or DOCX'
  }),

  fileSize: (file) => ({
    valid: !file || file.size <= MAX_FILE_SIZE,
    message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
  })
};

// Validate form field
export const validateField = (value, rules) => {
  const errors = [];
  
  for (const rule of rules) {
    const validator = validators[rule.type];
    if (!validator) continue;
    
    const result = validator(value, rule.value);
    if (!result.valid) {
      errors.push(result.message);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Validate entire form
export const validateForm = (values, schema) => {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const result = validateField(values[field], rules);
    if (!result.valid) {
      errors[field] = result.errors;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Common validation schemas
export const validationSchemas = {
  login: {
    email: [{ type: 'required' }, { type: 'email' }],
    password: [{ type: 'required' }]
  },

  register: {
    name: [{ type: 'required' }, { type: 'minLength', value: 2 }],
    email: [{ type: 'required' }, { type: 'email' }],
    password: [{ type: 'required' }, { type: 'password' }],
    confirmPassword: [{ type: 'required' }, { type: 'confirmPassword' }],
    college: [{ type: 'required' }],
    branch: [{ type: 'required' }],
    year: [{ type: 'required' }]
  },

  interviewSetup: {
    categoryId: [{ type: 'required' }],
    numQuestions: [{ type: 'required' }],
    timePerQuestion: [{ type: 'required' }]
  },

  profile: {
    name: [{ type: 'required' }, { type: 'minLength', value: 2 }],
    email: [{ type: 'required' }, { type: 'email' }],
    college: [{ type: 'required' }],
    branch: [{ type: 'required' }]
  }
};