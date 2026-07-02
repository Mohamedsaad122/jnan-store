import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive automatic re-fetch on tab focus
      retry: 1, // Retries failed requests once before giving up
      staleTime: 5 * 60 * 1000, // 5 minutes stale time default
    },
  },
});

export default queryClient;
