import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

import { getCurrentUser } from '../api/current-user';

interface UseCurrentUserOptions {
  enabled?: boolean;
}

export function useCurrentUser(
  options: UseCurrentUserOptions = {},
) {
  const {
    enabled = true,
  } = options;

  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: getCurrentUser,
    enabled,
  });
}