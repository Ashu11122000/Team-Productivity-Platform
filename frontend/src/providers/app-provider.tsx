'use client';

import type { ReactNode } from 'react';

import { Toaster } from 'sonner';

import { AuthInitializer } from '@/features/auth/components/auth-initializer';

import { AuthProvider } from './auth-provider';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

/**
 * ============================================================================
 * App Providers
 * ============================================================================
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Register global providers.
 * - Initialize authentication.
 * - Configure React Query.
 * - Configure application theme.
 * - Configure toast notifications.
 * ============================================================================
 */

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          {/* Restore authenticated user after hydration */}
          <AuthInitializer />

          {children}

          <Toaster
            position='top-right'
            richColors
            closeButton
            expand
            duration={4000}
            visibleToasts={5}
            theme='system'
          />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
