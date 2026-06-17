'use client';

import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '../api/current-user';

import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { useAuthStore } from '@/store/auth-store';

export function useCurrentUser() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: QUERY_KEYS.currentUser,

    queryFn: async () => {
      const user = await getCurrentUser();

      setUser(user);

      return user;
    },

    enabled: !!accessToken,

    retry: false,
  });
}
