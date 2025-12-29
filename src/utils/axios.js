import axios from 'axios';
import ENV from '../config/env';

/**
 * Axios instance configured for Laravel Sanctum authentication
 * 
 * Key configuration:
 * - withCredentials: true → Sends HTTP-only cookies with every request
 * - baseURL: Points to /api endpoint on backend
 * - Headers: Accept JSON responses
 * 
 * Laravel Sanctum uses HTTP-only cookies for authentication.
 * No manual token handling needed in frontend.
 */
const axiosServices = axios.create({
  baseURL: `${ENV.API_BASE_URL}/api`,
  withCredentials: true, // CRITICAL: Enables cookie-based auth (Laravel Sanctum)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Response interceptor for error handling
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized error (401)
    // This means the session cookie is invalid/expired
    if (error.response?.status === 401) {
      // Redirect to login if not already there
      if (window.location.pathname !== '/auth/login' && 
          !window.location.pathname.startsWith('/auth/')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject((error.response && error.response.data) || 'Request failed');
  }
);

export default axiosServices;
 