'use client';

import { useCurrentUser } from '../hooks/use-current-user';

import { useAuthStore } from '@/store/auth-store';

export function AuthInitializer() {
  const hydrated = useAuthStore(
    (state) => state.hydrated,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  useCurrentUser({
    enabled:
      hydrated &&
      isAuthenticated,
  });

  return null;
}