'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;

  fallback?: React.ReactNode;

  redirectTo?: string;
}

function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter();

  const hydrated = useAuthStore((state) => state.hydrated);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  React.useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [hydrated, isAuthenticated, redirectTo, router]);

  if (!hydrated) {
    return fallback ?? <LoadingSpinner fullPage text="Loading..." />;
  }

  if (!isAuthenticated) {
    return fallback ?? <LoadingSpinner fullPage text="Redirecting..." />;
  }

  return <>{children}</>;
}

export { ProtectedRoute };
