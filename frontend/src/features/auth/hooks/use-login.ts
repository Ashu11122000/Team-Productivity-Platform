'use client';

/**
 * ============================================================================
 * File: features/auth/hooks/use-login.ts
 * ============================================================================
 *
 * Login Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Authenticate the user via the FastAPI backend.
 * - Persist the authenticated user in the global auth store.
 * - Display authentication success and error notifications.
 * - Redirect authenticated users to the dashboard.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Authentication is fully owned by the FastAPI backend.
 * - The shared Axios client automatically handles API communication.
 * - NestJS only validates JWTs and never performs authentication.
 * ============================================================================
 */

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { login } from '../api/login';

import type { LoginRequest, LoginResponse } from '../types/login.types';

import { APP_ROUTES } from '@/lib/constants/navigation';
import { useAuthStore } from '@/store/auth-store';

/**
 * ============================================================================
 * Login Mutation Hook
 * ============================================================================
 */

export function useLogin() {
  const router = useRouter();

  const loginStore = useAuthStore((state) => state.login);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,

    onSuccess: (response) => {
      loginStore(response.data.access_token, response.data.user);

      toast.success(response.message ?? 'Login successful');

      router.replace(APP_ROUTES.DASHBOARD);
    },

    onError: (error) => {
      toast.error(error.message || 'Invalid email or password');
    },
  });
}
