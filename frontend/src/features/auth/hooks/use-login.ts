'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { login } from '../api/login';

import type {
  LoginRequest,
  LoginResponse,
} from '../types/login.types';

import { useAuthStore } from '@/store/auth-store';

export function useLogin() {
  const router = useRouter();

  const setAccessToken =
    useAuthStore(
      (state) => state.setAccessToken,
    );

  const setUser =
    useAuthStore(
      (state) => state.setUser,
    );

  return useMutation<
    LoginResponse,
    unknown,
    LoginRequest
  >({
    mutationFn: login,

    onSuccess: (response) => {
      setAccessToken(
        response.data.access_token,
      );

      setUser(
        response.data.user,
      );

      toast.success(
        response.message,
      );

      router.replace(
        '/dashboard',
      );
    },

    onError: () => {
      toast.error(
        'Invalid email or password',
      );
    },
  });
}