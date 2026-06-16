'use client';

import { useMemo } from 'react';

import { useAuthStore } from '@/store/auth-store';

import {
  isAdmin,
  isUser,
} from '../utils/permissions';

export function usePermissions() {
  const user =
    useAuthStore(
      (state) => state.user,
    );

  const role = user?.role;

  return useMemo(
    () => ({
      role,

      isAdmin: isAdmin(role),

      isUser: isUser(role),
    }),
    [role],
  );
}