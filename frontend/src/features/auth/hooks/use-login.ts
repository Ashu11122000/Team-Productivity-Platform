'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { login } from '../api/login';

import type { LoginRequest, LoginResponse } from '../types/login.types';

import { useAuthStore } from '@/store/auth-store';

export function useLogin() {
  const router = useRouter();

  const loginStore = useAuthStore((state) => state.login);

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: login,

    onSuccess: (response) => {
      loginStore(response.data.access_token, response.data.user);

      toast.success(response.message || 'Login successful');

      router.replace('/dashboard');
    },

    onError: () => {
      toast.error('Invalid email or password');
    },
  });
}
