/**
 * Environment Configuration
 * 
 * Centralized configuration for API endpoints and environment variables.
 * URLs are loaded from .env file to keep them secure.
 */

import { Platform } from 'react-native';

// Load URLs from environment variables (set in .env file)
const PRODUCTION_URL = process.env.EXPO_PUBLIC_PRODUCTION_URL || 'https://billbackend-production-4929.up.railway.app';
const DEV_ANDROID_URL = process.env.EXPO_PUBLIC_DEV_ANDROID_URL || 'http://10.0.2.2:3000';
const DEV_IOS_URL = process.env.EXPO_PUBLIC_DEV_IOS_URL || 'http://localhost:3000';

// Set this to true to use local development server, false for production
const USE_LOCAL_SERVER = process.env.EXPO_PUBLIC_USE_LOCAL_SERVER === 'true';

/**
 * Get the base URL for the backend server
 * Returns the appropriate URL based on environment and platform
 */
export const getBaseUrl = (): string => {
  if (USE_LOCAL_SERVER) {
    return Platform.OS === 'android' ? DEV_ANDROID_URL : DEV_IOS_URL;
  }
  return PRODUCTION_URL;
};

/**
 * Get the API URL (base URL + /api)
 */
export const getApiUrl = (): string => {
  return `${getBaseUrl()}/api`;
};

// Export commonly used URLs
export const API_BASE_URL = getApiUrl();
export const BACKEND_URL = getBaseUrl();

// Environment configuration object for easy access
export const ENV = {
  BACKEND_URL: getBaseUrl(),
  API_URL: getApiUrl(),
  IS_PRODUCTION: !USE_LOCAL_SERVER,
  IS_DEVELOPMENT: USE_LOCAL_SERVER,
} as const;

export default ENV;
