'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { login } from '../api/login';
import type { LoginRequest } from '../types/login.types';

import { useAuthStore } from '@/store/auth-store';

export function useLogin() {
  const router = useRouter();

  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken,
  );

  const setUser = useAuthStore(
    (state) => state.setUser,
  );

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      login(data),

    onSuccess: (response) => {
      setAccessToken(
        response.data.access_token,
      );

      setUser(
        response.data.user,
      );

      toast.success(
        'Login successful',
      );

      router.push('/dashboard');
    },

    onError: () => {
      toast.error(
        'Invalid email or password',
      );
    },
  });
}