'use client';

import { ReactNode, useState } from 'react';

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({
    children,
}: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                    staleTime: 1000 * 60,
                    gcTime: 1000 * 60 * 5,
                    retry: 1,
                    refetchOnWindowFocus: false,
                },
                mutations: {
                    retry: 0,
                },
            },
        }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}