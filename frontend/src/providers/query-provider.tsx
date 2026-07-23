'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const QUERY_STALE_TIME = 5 * 60 * 1000;

const QUERY_GC_TIME = 30 * 60 * 1000;

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_STALE_TIME,

            gcTime: QUERY_GC_TIME,

            retry: 1,

            networkMode: 'online',

            refetchOnWindowFocus: false,

            refetchOnReconnect: false,

            refetchOnMount: false,

            structuralSharing: true,
          },

          mutations: {
            retry: 0,

            networkMode: 'online',
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
