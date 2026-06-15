'use client';

import type { ReactNode } from 'react';

import { useAuthStore } from '@/store/auth-store';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({
  children,
  allowedRoles,
}: RoleGuardProps) {
  const user = useAuthStore(
    (state) => state.user,
  );

  if (!user) {
    return null;
  }

  const hasAccess =
    allowedRoles.includes(
      user.role,
    );

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-xl font-semibold">
          Access Denied
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}