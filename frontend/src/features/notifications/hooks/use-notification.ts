import { useQuery } from '@tanstack/react-query';

import { getNotification } from '../api/get-notification';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

export function useNotification(
  id: string,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATIONS, id],
    queryFn: () => getNotification(id),
    enabled: !!id,
  });
}