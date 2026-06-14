'use client';

import { useEffect, type ReactNode } from 'react';

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
      (state) => state.isAuthenticated,
    );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [
    isAuthenticated,
    router,
  ]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}