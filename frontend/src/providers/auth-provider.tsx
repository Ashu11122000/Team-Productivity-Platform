'use client';

import type { ReactNode } from 'react';

import { useAuthStore } from '@/store/auth-store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const hydrated = useAuthStore((state) => state.hydrated);

  /**
   * Prevent the application from rendering until
   * the persisted authentication state has been
   * restored from storage.
   */
  if (!hydrated) {
    return (
      <main
        className='bg-background flex min-h-screen items-center justify-center'
        aria-busy='true'
        aria-live='polite'
      >
        <div
          className='border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent'
          role='status'
          aria-label='Loading application'
        />
      </main>
    );
  }

  return children;
}
