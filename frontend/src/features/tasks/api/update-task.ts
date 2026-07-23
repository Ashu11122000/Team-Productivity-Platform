/**
 * ============================================================================
 * File: features/tasks/api/update-task.ts
 * ============================================================================
 *
 * Update Task API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Update an existing task via the NestJS backend.
 * - Return the updated task.
 * - Keep the frontend aligned with the NestJS API contract.
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

import type { Task } from '../types/task.types';
import type { UpdateTaskRequest } from '../types/update-task.types';

/**
 * ============================================================================
 * Update Task Response
 * ============================================================================
 */

interface UpdateTaskResponse {
  readonly success: boolean;

  readonly message: string;

  readonly data: Task;
}

/**
 * ============================================================================
 * Update Task
 * ============================================================================
 */

export async function updateTask(id: string, payload: UpdateTaskRequest): Promise<Task> {
  const { data } = await nestjsClient.patch<UpdateTaskResponse>(
    NESTJS_ROUTES.TASKS.BY_ID(id),
    payload,
  );

  return data.data;
}
