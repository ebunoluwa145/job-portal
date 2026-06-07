import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // These settings prevent "strange" data behavior on reload
      retry: 1, 
      refetchOnWindowFocus: false, // Prevents refetching every time you switch tabs
      staleTime: 5 * 60 * 1000, // Data stays "fresh" for 5 minutes
    },
  },
});