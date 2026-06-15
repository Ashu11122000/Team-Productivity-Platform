'use client';

import { useQuery } from '@tanstack/react-query';

import { getTask } from '../api/get-task';

export function useTask(id: string) {
  return useQuery({
    queryKey: ['task', id],

    queryFn: () => getTask(id),

    enabled: !!id,
  });
}