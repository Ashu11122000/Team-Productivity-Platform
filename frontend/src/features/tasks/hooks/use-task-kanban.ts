'use client';

import { useMemo } from 'react';

import { useTasks } from './use-tasks';

export function useTaskKanban() {
  const {
    data,
    isLoading,
    isError,
  } = useTasks();

  const tasks =
    data?.data ?? [];

  const columns =
    useMemo(
      () => ({
        TODO: tasks.filter(
          (task) =>
            task.status ===
            'TODO',
        ),

        IN_PROGRESS:
          tasks.filter(
            (task) =>
              task.status ===
              'IN_PROGRESS',
          ),

        COMPLETED:
          tasks.filter(
            (task) =>
              task.status ===
              'COMPLETED',
          ),
      }),
      [tasks],
    );

  return {
    columns,
    tasks,
    isLoading,
    isError,
  };
}