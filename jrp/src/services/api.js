import axiosInstance from '../api/axios';

export const jobsApi = {
  // Get all jobs with filters
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.industry) params.append('industry', filters.industry);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await axiosInstance.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  // Get single job
  getJob: async (id) => {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  },

  // Create new job
  createJob: async (jobData) => {
    const response = await axiosInstance.post('/jobs', jobData);
    return response.data;
  },

  // Update job
  updateJob: async (id, jobData) => {
    const response = await axiosInstance.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await axiosInstance.delete(`/jobs/${id}`);
    return response.data;
  },

  // Get unique locations and industries for filters
  getFilterOptions: async () => {
    const response = await axiosInstance.get('/jobs');
    const jobs = response.data.jobs || [];
    
    const locations = [...new Set(jobs.map(job => job.location))].filter(Boolean);
    const industries = [...new Set(jobs.map(job => job.industry))].filter(Boolean);
    
    return { locations, industries };
  }
};

export const applicationsApi = {
  // Apply to a job
  applyToJob: async (jobId, applicationData) => {
    const formData = new FormData();
    formData.append('jobId', jobId);
    
    if (applicationData.resume) {
      formData.append('resume', applicationData.resume);
    }
    
    if (applicationData.coverLetter) {
      formData.append('coverLetter', applicationData.coverLetter);
    }

    const response = await axiosInstance.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Check if user has applied to a job
  checkApplicationStatus: async (jobId) => {
    const response = await axiosInstance.get(`/applications/check/${jobId}`);
    return response.data;
  },

  // Get user's applications
  getUserApplications: async () => {
    const response = await axiosInstance.get('/applications/user');
    return response.data;
  },

  // Get applications for a specific job (for employers)
  getJobApplications: async (jobId) => {
    const response = await axiosInstance.get(`/admin/jobs/${jobId}/applications`);
    return response.data;
  },

  // Update application status (for employers/admins)
  updateApplicationStatus: async (applicationId, status) => {
    const response = await axiosInstance.put(`/admin/applications/${applicationId}`, { status });
    return response.data;
  }
};

export const authApi = {
  // Login
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/auth/me', profileData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  }
};

export const adminApi = {
  // Get all users
  getUsers: async () => {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  },

  // Get all jobs (admin view)
  getJobs: async () => {
    const response = await axiosInstance.get('/admin/jobs');
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Delete job
  deleteJob: async (jobId) => {
    const response = await axiosInstance.delete(`/admin/jobs/${jobId}`);
    return response.data;
  }
};

export const uploadApi = {
  // Upload file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/upload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
