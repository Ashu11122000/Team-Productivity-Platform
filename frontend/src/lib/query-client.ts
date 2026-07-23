import { QueryClient } from '@tanstack/react-query';

/**
 * ============================================================================
 * React Query Configuration
 * ============================================================================
 */

const QUERY_STALE_TIME = 5 * 60 * 1000;

const QUERY_GC_TIME = 30 * 60 * 1000;

/**
 * ============================================================================
 * Query Client Factory
 * ============================================================================
 */

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME,

        gcTime: QUERY_GC_TIME,

        retry: 1,

        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),

        networkMode: 'online',

        refetchOnWindowFocus: false,

        refetchOnReconnect: true,

        refetchOnMount: true,

        structuralSharing: true,
      },

      mutations: {
        retry: 0,

        networkMode: 'online',
      },
    },
  });
}
