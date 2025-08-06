import axios from 'axios';

// Determine API base URL based on environment
const getBaseURL = () => {
    if (import.meta.env.DEV) {
        // Development environment
        return 'http://localhost:5001/api';
    } else {
        // Production environment (Vercel)
        return '/api';
    }
};

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add request interceptor for debugging in development
if (import.meta.env.DEV) {
    axiosInstance.interceptors.request.use(
        (config) => {
            console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
            return config;
        },
        (error) => {
            console.error('Request error:', error);
            return Promise.reject(error);
        }
    );
}

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.warn('Unauthorized access - redirecting to login');
            // You can add automatic redirect logic here if needed
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;