import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/utils/errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive automatic re-fetch on tab focus
      staleTime: 5 * 60 * 1000, // 5 minutes stale time default
      retry: (failureCount, error) => {
        // Maximum 2 retries
        if (failureCount >= 2) return false;

        // Do not retry on client-side errors (400 - 499)
        if (error instanceof ApiError) {
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
        }

        return true;
      },
    },
  },
});

export default queryClient;
