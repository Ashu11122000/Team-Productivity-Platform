import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getTaskStatusAnalytics } from '../api/get-task-status';

export const useTaskStatus = () => {
  return useQuery({
    queryKey: QUERY_KEYS.taskStatusAnalytics,
    queryFn: getTaskStatusAnalytics,
  });
};