'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { FASTAPI_ROUTES } from '@/lib/constants/api-routes';
import { fastapiClient } from '@/services/fastapi/client';
import { useAuthStore } from '@/store/auth-store';

import type { AuthMeResponse } from '@/features/auth/types/auth.types';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const hydrated = useAuthStore((state) => state.hydrated);

  const accessToken = useAuthStore((state) => state.accessToken);

  const setUser = useAuthStore((state) => state.setUser);

  const logout = useAuthStore((state) => state.logout);

  /**
   * Prevent duplicate authentication requests.
   */
  const initialized = useRef(false);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!accessToken) {
      return;
    }

    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const initializeUser = async () => {
      try {
        const response = await fastapiClient.get<AuthMeResponse>(FASTAPI_ROUTES.AUTH.ME);

        /**
         * If your backend later returns more user
         * fields, this mapping can be removed.
         */
        setUser({
          id: Number(response.data.id),
          email: response.data.email,
          role: response.data.role as never,
          is_active: true,
        });
      } catch {
        /**
         * Invalid or expired JWT.
         */
        logout();
      }
    };

    void initializeUser();
  }, [hydrated, accessToken, logout, setUser]);

  /**
   * Wait until Zustand has restored the persisted
   * authentication state.
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

  return <>{children}</>;
}
