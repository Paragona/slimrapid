// JWT related constants
export const JWT_COOKIE_NAME = 'destinopia_auth_token'

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  USER: {
    PROFILE: '/api/users/me',
    UPDATE: '/api/users/me',
  },
} as const;

// Query Keys
export const QUERY_KEYS = {
  USER: 'user',
  PROFILE: 'profile',
} as const;

// Websocket Events
export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  MESSAGE: 'message',
} as const;

// Other application constants can be added here
