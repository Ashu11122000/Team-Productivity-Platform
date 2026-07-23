'use client';

/**
 * ============================================================================
 * File: features/tasks/hooks/use-task-kanban.ts
 * ============================================================================
 *
 * Task Kanban Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Transform the task list into Kanban columns.
 * - Group tasks by status.
 * - Memoize grouped data for rendering efficiency.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Task data is fetched through useTasks().
 * - Task management is owned by the NestJS backend.
 * ============================================================================
 */

import { useMemo } from 'react';

import { useTasks } from './use-tasks';

import { groupTasksByStatus } from '../utils/task.utils';

import type { Task, TaskStatus } from '../types/task.types';

/**
 * ============================================================================
 * Kanban Columns
 * ============================================================================
 */

export type KanbanColumns = Record<TaskStatus, readonly Task[]>;

/**
 * ============================================================================
 * Task Kanban Hook
 * ============================================================================
 */

export function useTaskKanban() {
  const { data, isLoading, isError } = useTasks();

  const tasks = useMemo(
    () => data?.data ?? [],

    [data],
  );

  const columns = useMemo<KanbanColumns>(
    () => groupTasksByStatus(tasks),

    [tasks],
  );

  return {
    columns,

    tasks,

    isLoading,

    isError,
  };
}
