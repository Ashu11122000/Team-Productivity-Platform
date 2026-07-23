import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '../api/current-user';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

interface UseCurrentUserOptions {
  enabled?: boolean;
}

const CURRENT_USER_STALE_TIME = 10 * 60 * 1000;

const CURRENT_USER_GC_TIME = 30 * 60 * 1000;

export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: QUERY_KEYS.profile,

    queryFn: getCurrentUser,

    enabled,

    staleTime: CURRENT_USER_STALE_TIME,

    gcTime: CURRENT_USER_GC_TIME,

    retry: 0,

    refetchOnWindowFocus: false,
  });
}
