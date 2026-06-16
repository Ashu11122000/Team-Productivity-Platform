'use client';

import type { ReactNode } from 'react';

import { useAuthStore } from '@/store/auth-store';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) {
  const user =
    useAuthStore(
      (state) => state.user,
    );

  const hydrated =
    useAuthStore(
      (state) => state.hydrated,
    );

  if (!hydrated) {
    return null;
  }

  if (!user) {
    return fallback;
  }

  const hasAccess =
    allowedRoles.includes(
      user.role,
    );

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
}