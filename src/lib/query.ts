import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ErrorResponseSchema } from './api';
import { queryRetrySchema } from './validation';
import { z } from 'zod';

// Create a function to handle errors globally
export const handleQueryError = (error: unknown) => {
  const axiosError = error as AxiosError;
  const data = axiosError.response?.data;
  try {
    const parsed = ErrorResponseSchema.parse(data);
    console.error(parsed.detail);
  } catch {
    console.error('An unexpected error occurred');
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: ((failureCount: number, error: unknown) => {
        const axiosError = error as AxiosError;
        // Don't retry on 404s or 401s
        if (axiosError.response?.status === 404 || axiosError.response?.status === 401) {
          return false;
        }
        return failureCount < 3;
      }) satisfies z.infer<typeof queryRetrySchema>,
    },
  },
  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
  mutationCache: new MutationCache({
    onError: handleQueryError,
  }),
});
