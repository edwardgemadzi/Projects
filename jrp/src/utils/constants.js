// Application constants
export const APP_CONFIG = {
  name: 'Job Recruitment Platform',
  version: '1.0.0',
  description: 'Connect employers with talented job seekers',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYER: 'employer',
  JOBSEEKER: 'jobseeker',
};

// Application statuses
export const APPLICATION_STATUSES = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  INTERVIEW: 'interview',
  REJECTED: 'rejected',
  HIRED: 'hired',
};

// File upload settings
export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: {
    resume: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  allowedExtensions: {
    resume: ['.pdf', '.doc', '.docx'],
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },
};

// Pagination settings
export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 50,
  pageSizes: [5, 10, 20, 50],
};

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  jobs: {
    list: '/jobs',
    create: '/jobs',
    detail: (id) => `/jobs/${id}`,
    update: (id) => `/jobs/${id}`,
    delete: (id) => `/jobs/${id}`,
  },
  applications: {
    create: '/applications',
    list: '/applications/user',
    check: (jobId) => `/applications/check/${jobId}`,
  },
  admin: {
    users: '/admin/users',
    jobs: '/admin/jobs',
    deleteUser: (id) => `/admin/users/${id}`,
    deleteJob: (id) => `/admin/jobs/${id}`,
  },
  upload: '/upload/upload',
};

// Form validation rules
export const VALIDATION_RULES = {
  user: {
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    password: { required: true, password: true },
  },
  job: {
    title: { required: true, minLength: 3 },
    company: { required: true, minLength: 2 },
    location: { required: true, minLength: 2 },
    industry: { required: true },
    description: { required: true, minLength: 50 },
  },
  application: {
    coverLetter: { minLength: 100 },
  },
};

// UI Constants
export const UI = {
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
  colors: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
  },
  notifications: {
    duration: {
      short: 3000,
      medium: 5000,
      long: 8000,
    },
  },
};

// Feature flags
export const FEATURES = {
  enableEmailNotifications: true,
  enableFileUpload: true,
  enableApplicationTracking: true,
  enableAdvancedSearch: true,
  enableSocialLogin: false,
  enablePaymentIntegration: false,
};

// Error messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  fileUpload: 'File upload failed. Please try again.',
  fileTooLarge: `File size exceeds ${FILE_UPLOAD.maxSize / (1024 * 1024)}MB limit.`,
  invalidFileType: 'Invalid file type. Please upload a supported file.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in!',
  register: 'Account created successfully!',
  logout: 'Successfully logged out!',
  profileUpdate: 'Profile updated successfully!',
  jobCreated: 'Job posted successfully!',
  jobUpdated: 'Job updated successfully!',
  jobDeleted: 'Job deleted successfully!',
  applicationSubmitted: 'Application submitted successfully!',
  fileUploaded: 'File uploaded successfully!',
};

// Local storage keys
export const STORAGE_KEYS = {
  userPreferences: 'jrp_user_preferences',
  searchFilters: 'jrp_search_filters',
  recentSearches: 'jrp_recent_searches',
  drafts: 'jrp_drafts',
};

// Date formats
export const DATE_FORMATS = {
  short: { month: 'short', day: 'numeric', year: 'numeric' },
  long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  time: { hour: '2-digit', minute: '2-digit' },
  datetime: { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  },
};
