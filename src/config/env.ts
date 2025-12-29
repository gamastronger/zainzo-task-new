// src/config/env.ts
// =====================================================
// Centralized & minimal environment configuration
// Frontend MUST NOT know Google OAuth internals
// =====================================================

export const ENV = {
  // Backend (Laravel)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,

  // Frontend
  APP_URL: import.meta.env.VITE_APP_URL as string,

  // Environment flags
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// Optional runtime validation (recommended during dev)
export const validateEnv = () => {
  const errors: string[] = [];

  if (!ENV.API_BASE_URL) {
    errors.push('VITE_API_BASE_URL is not set');
  }

  if (!ENV.APP_URL) {
    errors.push('VITE_APP_URL is not set');
  }

  if (errors.length > 0) {
    console.error('❌ ENV CONFIG ERROR');
    errors.forEach(e => console.error(`- ${e}`));
  }

  return errors.length === 0;
};

export default ENV;
