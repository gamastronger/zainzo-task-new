import axios from 'axios';
import ENV from '../config/env';

// Base URL untuk Laravel Backend API
// All API endpoints will be prefixed with /api on the backend
const axiosServices = axios.create({
  baseURL: `${ENV.API_BASE_URL}/api`,
  withCredentials: true, // Important untuk cookies/session
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor untuk menambahkan token ke setiap request
axiosServices.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized error
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      // Redirect ke login jika unauthorized
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;
 