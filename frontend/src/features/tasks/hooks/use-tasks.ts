'use client';

import { useQuery } from '@tanstack/react-query';

import { getTasks } from '../api/get-tasks';

import type { TaskQueryParams } from '../types/task-query.types';

export function useTasks(
  params?: TaskQueryParams,
) {
  return useQuery({
    queryKey: ['tasks', params],

    queryFn: () =>
      getTasks(params),

    staleTime: 1000 * 60,
  });
}