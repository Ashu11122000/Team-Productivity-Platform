'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { logout } from '../api/logout';

import { useAuthStore } from '@/store/auth-store';

export function useLogout() {
  const queryClient = useQueryClient();

  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.clear();

      logoutStore();

      toast.success('Logged out successfully');
    },

    onError: () => {
      queryClient.clear();

      logoutStore();

      toast.info('Session cleared');
    },
  });
}
