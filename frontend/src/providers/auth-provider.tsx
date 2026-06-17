'use client';

import { ReactNode } from 'react';

import { useAuthStore } from '@/store/auth-store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const hydrated = useAuthStore((state) => state.hydrated);

  if (!hydrated) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
