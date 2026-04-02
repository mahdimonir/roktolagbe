import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for httpOnly cookies
});

// Interceptor to add access token to headers if it's stored in memory or localStorage
// Note: Refresh token is handled by httpOnly cookies automatically by the browser
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle token expiration/refresh if needed
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Handle 401 errors, token refresh logic could go here
    return Promise.reject(error.response?.data || error.message);
  }
);
