'use client';

/**
 * ============================================================================
 * File: features/auth/hooks/use-register.ts
 * ============================================================================
 *
 * Register Mutation Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Register a new user via the FastAPI backend.
 * - Display registration success and error notifications.
 * - Expose the registration mutation to UI components.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Registration is fully owned by the FastAPI backend.
 * - Successful registration does not authenticate the user.
 * - Users must log in after successful registration.
 * ============================================================================
 */

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { register } from '../api/register';

import type { RegisterRequest, RegisterResponse } from '../types/register.types';

/**
 * ============================================================================
 * Register Mutation Hook
 * ============================================================================
 */

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: register,

    onSuccess: () => {
      toast.success('Registration successful. Please log in.');
    },

    onError: (error) => {
      toast.error(error.message || 'Registration failed.');
    },
  });
}
