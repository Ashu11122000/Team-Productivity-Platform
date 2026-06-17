'use client';

import { useCurrentUser } from '../hooks/use-current-user';
import { useAuthStore } from '@/store/auth-store';

export function AuthInitializer() {
  const hydrated = useAuthStore(
    (state) => state.hydrated
  );

  useCurrentUser();

  if (!hydrated) {
    return null;
  }

  return null;
}