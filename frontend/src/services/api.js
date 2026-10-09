import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s timeout for RAG search / Ollama processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('docintel_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (!error.response) {
      errorMessage = 'Unable to connect to the server. Please make sure the backend is running.';
    } else {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem('docintel_token');
        localStorage.removeItem('docintel_user');

        // Only redirect if not already on login or register page
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login?session_expired=true';
        }
        errorMessage = data?.message || 'Session expired. Please log in again.';
      } else if (status === 400) {
        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage = data.errors.map(err => err.msg || err.message).join(', ');
        } else {
          errorMessage = data?.message || 'Invalid request parameters.';
        }
      } else if (status === 404) {
        errorMessage = data?.message || 'Resource not found.';
      } else if (status === 403) {
        errorMessage = data?.message || 'You do not have permission to perform this action.';
      } else if (status >= 500) {
        errorMessage = data?.message || 'Server error. Please try again later.';
      } else if (data?.message) {
        errorMessage = data.message;
      }
    }

    // Attach human-readable formatted message to error object
    error.userMessage = errorMessage;
    return Promise.reject(error);
  }
);

// Modular API endpoints
export const authAPI = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  getMe: () => api.get('/auth/me'),
};

export const documentAPI = {
  getDocuments: () => api.get('/documents'),
  uploadDocument: (formData, onProgress) =>
    api.post('/documents/upload', formData, {
      headers: {
        // Let browser set multipart boundary
        'Content-Type': undefined,
      },
      onUploadProgress: onProgress,
    }),
  deleteDocument: (id) => api.delete(`/documents/${id}`),
};

export const searchAPI = {
  search: (query) => api.post('/search', { query }),
};

export default api;
