'use client';

import {
  useEffect,
  type ReactNode,
} from 'react';

import { useRouter } from 'next/navigation';

import { Loader2 } from 'lucide-react';

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
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
        "
      >
        <Loader2
          className="
            h-8
            w-8
            animate-spin
            text-indigo-600
          "
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
        "
      >
        <Loader2
          className="
            h-8
            w-8
            animate-spin
            text-indigo-600
          "
        />
      </div>
    );
  }

  return <>{children}</>;
}