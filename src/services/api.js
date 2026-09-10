import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Centralized Request Interceptor (JWT Token Attachment)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Centralized Response Interceptor (401 Unauthorized handling)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gv_token');
      localStorage.removeItem('gv_hr_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const checkHealth = async () => {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (err) {
    return { status: 'error' };
  }
};

export default api;

