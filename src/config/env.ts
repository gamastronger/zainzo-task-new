// Environment Configuration
// Centralized environment variables untuk seluruh aplikasi
// IMPORTANT: Pastikan .env file sudah diisi dengan benar!

export const ENV = {
  // API Configuration
  // Backend base URL - diambil dari .env (WAJIB diisi di .env)
  API_URL: import.meta.env.VITE_API_URL || '',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  
  // Frontend Configuration
  APP_URL: import.meta.env.VITE_APP_URL || '',
  APP_PORT: import.meta.env.VITE_APP_PORT || 5173,
  
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI || '',
  
  // Development Mode
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// Type-safe environment configuration
export type EnvConfig = typeof ENV;

// Helper function untuk validasi env variables
export const validateEnv = () => {
  const errors: string[] = [];
  
  if (!ENV.API_URL) {
    errors.push('VITE_API_URL is not set in .env file');
  }
  
  if (!ENV.API_BASE_URL) {
    errors.push('VITE_API_BASE_URL is not set in .env file');
  }
  
  if (!ENV.APP_URL) {
    errors.push('VITE_APP_URL is not set in .env file');
  }
  
  if (!ENV.GOOGLE_CLIENT_ID) {
    errors.push('VITE_GOOGLE_CLIENT_ID is not set in .env file');
  }
  
  if (!ENV.GOOGLE_REDIRECT_URI) {
    errors.push('VITE_GOOGLE_REDIRECT_URI is not set in .env file');
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment Configuration Errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('💡 Pastikan file .env sudah dibuat dari .env.example dan diisi dengan benar!');
  }
  
  return errors.length === 0;
};

export default ENV;
