// Environment Configuration
// Centralized environment variables untuk seluruh aplikasi

export const ENV = {
  // API Configuration
  // API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', // Base URL without /api
  // API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api', // API endpoints
  API_URL: import.meta.env.VITE_API_URL || 'https://api.zainzo.com/api', // Base URL without /api
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.zainzo.com/api', // API endpoints
  
  // Frontend Configuration
  // APP_URL: import.meta.env.VITE_APP_URL || 'https://localhost:5173',
  APP_URL: import.meta.env.VITE_APP_URL || 'https://task.zainzo.com',
  APP_PORT: import.meta.env.VITE_APP_PORT || 5173,
  
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  // GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/callback',
  GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'https://task.zainzo.com/callback',
  
  // Development Mode
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// Type-safe environment configuration
export type EnvConfig = typeof ENV;

// Helper function untuk validasi env variables
export const validateEnv = () => {
  const errors: string[] = [];
  
  if (!ENV.GOOGLE_CLIENT_ID) {
    errors.push('VITE_GOOGLE_CLIENT_ID is not set in .env.local');
  }
  
  if (errors.length > 0) {
    console.warn('⚠️ Environment Configuration Warnings:');
    errors.forEach(error => console.warn(`  - ${error}`));
  }
  
  return errors.length === 0;
};

export default ENV;
