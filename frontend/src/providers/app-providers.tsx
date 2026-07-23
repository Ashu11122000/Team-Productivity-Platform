'use client';

import type { ReactNode } from 'react';

import { Toaster } from 'sonner';

import { AuthInitializer } from '@/features/auth/components/auth-initializer';

import { AuthProvider } from './auth-provider';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <AuthInitializer />

          {children}

          <Toaster richColors position='top-right' closeButton />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
