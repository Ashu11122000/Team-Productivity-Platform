'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { register } from '../api/register';
import type { RegisterRequest } from '../types/register.types';

export function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterRequest) => register(data),

        onSuccess: () => {
            toast.success('Registration successful. Please login.');
        },

        onError: () => {
            toast.error('Registration failed');
        },
    });
}