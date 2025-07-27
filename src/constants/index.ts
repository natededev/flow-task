export * from './tasks';
export * from './projects';

// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  TASKS: {
    LIST: '/tasks',
    DETAIL: (id: string) => `/tasks/${id}`,
    CREATE: '/tasks',
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
  },
  PROJECTS: {
    LIST: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    CREATE: '/projects',
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    STATS: (id: string) => `/projects/${id}/stats`,
  },
} as const;

// Query Configuration
export const QUERY_CONFIG = {
  STALE_TIME: {
    SHORT: 2 * 60 * 1000, // 2 minutes
    MEDIUM: 5 * 60 * 1000, // 5 minutes
    LONG: 10 * 60 * 1000, // 10 minutes
  },
  CACHE_TIME: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 10 * 60 * 1000, // 10 minutes
    LONG: 15 * 60 * 1000, // 15 minutes
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Flow Task',
  VERSION: '1.0.0',
  THEME: {
    DEFAULT: 'system',
    OPTIONS: ['light', 'dark', 'system'] as const,
  },
} as const;
