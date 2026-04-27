import axios from 'axios';

// API base URL uses env var in production; falls back to same-origin /api.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * API Service
 * Handles all API calls to the backend
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const storedUser = localStorage.getItem('dw_user');
    if (!storedUser) return config;

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser?.idToken) {
      config.headers.Authorization = `Bearer ${parsedUser.idToken}`;
    }
  } catch (error) {
    console.warn('Failed to attach auth token:', error);
  }

  return config;
});

/**
 * Upload student work
 * @param {FormData} formData - Form data containing file and metadata
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise} Upload response
 */
export const uploadWork = async (formData, onUploadProgress) => {
  try {
    // Check if it's a URL-based upload (website/video) or file upload
    const isFormData = formData instanceof FormData;
    const hasFile = isFormData && formData.has('file');

    const config = {
      headers: hasFile ? {
        'Content-Type': 'multipart/form-data',
      } : {
        'Content-Type': 'application/json',
      },
    };

    // Add progress tracking only for file uploads
    if (hasFile && onUploadProgress) {
      config.onUploadProgress = (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      };
    }

    const response = await api.post('/upload', formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get all works with optional filters
 * @param {Object} filters - Filter options (category, search, sort)
 * @returns {Promise} Works list
 */
export const getWorks = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const response = await api.get(`/works?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get single work by ID
 * @param {string} id - Work ID
 * @returns {Promise} Work details
 */
export const getWorkById = async (id) => {
  try {
    const response = await api.get(`/works/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;
