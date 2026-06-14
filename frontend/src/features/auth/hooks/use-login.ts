'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { login } from '../api/login';
import type { LoginRequest } from '../types/login.types';
import { useAuthStore } from '@/store/auth-store';

export function useLogin() {
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    return useMutation({
        mutationFn: (data: LoginRequest) =>
            login(data),

            onSuccess: (response) => {
                setAccessToken(response.access_token);

                toast.success('Login successful');
            },

            onError: () => {
                toast.error('Invalid email or password');
            },
        });
}