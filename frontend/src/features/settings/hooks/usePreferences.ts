import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getPreferences } from '../api/get-preferences';

export function usePreferences() {
  return useQuery({
    queryKey: QUERY_KEYS.preferences,
    queryFn: getPreferences,
  });
}