'use client';

import { useQuery } from '@tanstack/react-query';

import { getTask } from '../api/get-task';

import { QUERY_KEYS } from '@/constants/query-keys';

export function useTask(
  id: string,
) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.TASKS,
      id,
    ],

    queryFn: () =>
      getTask(id),

    enabled: !!id,
  });
}