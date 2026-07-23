'use client';

import { memo } from 'react';

import { useCurrentUser } from '../hooks/use-current-user';

import { useAuthStore } from '@/store/auth-store';

export const AuthInitializer = memo(function AuthInitializer() {
  /**
   * Bootstrap authenticated user data
   * after the persisted auth state
   * has been restored.
   */
  const { hydrated, isAuthenticated } = useAuthStore((state) => ({
    hydrated: state.hydrated,
    isAuthenticated: state.isAuthenticated,
  }));

  useCurrentUser({
    enabled: hydrated && isAuthenticated,
  });

  return null;
});
