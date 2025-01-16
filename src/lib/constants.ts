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
  CALCULATOR: {
    COST: '/api/calculator/cost',
    ROUTE: '/api/calculator/route',
    GEOCODE: '/api/calculator/geocode',
  }
} as const;

// Query Keys
export const QUERY_KEYS = {
  USER: 'user',
  PROFILE: 'profile',
  CALCULATOR: {
    COST: 'calculator-cost',
    ROUTE: 'calculator-route',
    GEOCODE: 'calculator-geocode',
    SUGGESTIONS: 'calculator-suggestions'
  }
} as const;

// Calculator Constants
export const CALCULATOR_CONSTANTS = {
  MIN_ZOOM: 1,
  MAX_ZOOM: 20,
  DEFAULT_ZOOM: 4,
  DEFAULT_CENTER: [-98.5795, 39.8283] as [number, number], // Center of USA
  MIN_ADDRESS_LENGTH: 3,
  MAX_SUGGESTIONS: 5,
  DEBOUNCE_MS: 300,
  ROUTE_LINE_WIDTH: 4,
  ROUTE_LINE_OPACITY: 0.8,
  MARKER_SIZE: 20
} as const;

// Websocket Events
export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  MESSAGE: 'message',
} as const;

// Other application constants can be added here
