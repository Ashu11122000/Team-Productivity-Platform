/**
 * ============================================================================
 * File: features/tasks/api/update-task-status.ts
 * ============================================================================
 *
 * Update Task Status API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Update the status of an existing task.
 * - Communicate with the NestJS backend.
 * - Return the updated task.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Task management is fully owned by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * - The shared NestJS Axios client automatically attaches the JWT.
 * ============================================================================
 */

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';
import { nestjsClient } from '@/services/nestjs/client';

import type { Task, TaskStatus } from '../types/task.types';

/**
 * ============================================================================
 * Update Task Status Parameters
 * ============================================================================
 */

export interface UpdateTaskStatusParams {
  readonly id: string;

  readonly status: TaskStatus;
}

/**
 * ============================================================================
 * Update Task Status Response
 * ============================================================================
 */

interface UpdateTaskStatusResponse {
  readonly success: boolean;

  readonly message: string;

  readonly data: Task;
}

/**
 * ============================================================================
 * Update Task Status
 * ============================================================================
 */

export async function updateTaskStatus({ id, status }: UpdateTaskStatusParams): Promise<Task> {
  const { data } = await nestjsClient.patch<UpdateTaskStatusResponse>(
    NESTJS_ROUTES.TASKS.BY_ID(id),
    {
      status,
    },
  );

  return data.data;
}
