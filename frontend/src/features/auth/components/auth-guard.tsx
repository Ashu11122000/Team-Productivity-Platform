'use client';

import {
  useEffect,
  type ReactNode,
} from 'react';

import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/auth-store';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated,
    );

  const hydrated =
    useAuthStore(
      (state) => state.hydrated,
    );

  useEffect(() => {
    if (
      hydrated &&
      !isAuthenticated
    ) {
      router.replace('/login');
    }
  }, [
    hydrated,
    isAuthenticated,
    router,
  ]);

  if (!hydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}