import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getProfile } from '../api/get-profile';

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: getProfile,
  });
}