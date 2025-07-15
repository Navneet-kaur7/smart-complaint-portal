export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED'
} as const;

export const USER_ROLES = {
  CONSUMER: 'CONSUMER',
  REVIEWER: 'REVIEWER'
} as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'access_token',
  USER: 'user_data',
  
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update'
  },
  COMPLAINTS: {
    BASE: '/complaints',
    BY_USER: '/complaints/user',
    UPDATE_STATUS: '/complaints/status'
  },
  COMMENTS: {
    BASE: '/comments',
    BY_COMPLAINT: '/comments/complaint'
  }
} as const;

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 6,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  },
  COMPLAINT: {
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 1000
  },
  COMMENT: {
    MAX_LENGTH: 500
  }
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful! You can now log in.',
  COMPLAINT_CREATED: 'Complaint created successfully!',
  COMPLAINT_UPDATED: 'Complaint updated successfully!',
  COMPLAINT_DELETED: 'Complaint deleted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
} as const;