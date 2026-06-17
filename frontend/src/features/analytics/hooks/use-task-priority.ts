import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

import { getTaskPriorityAnalytics } from '../api/get-task-priority';

export const useTaskPriority = () => {
  return useQuery({
    queryKey: QUERY_KEYS.taskPriorityAnalytics,
    queryFn: getTaskPriorityAnalytics,
  });
};