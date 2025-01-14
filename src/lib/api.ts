import axios from 'axios';
import { z } from 'zod';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error response schema
export const ErrorResponseSchema = z.object({
  detail: z.string(),
});

// API response wrapper
export type ApiResponse<T> = {
  data: T;
  error?: z.infer<typeof ErrorResponseSchema>;
};

export { api };
