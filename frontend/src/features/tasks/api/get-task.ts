/**
 * ============================================================================
 * File: features/tasks/api/get-task.ts
 * ============================================================================
 *
 * Get Task API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve a single task by its identifier.
 * - Communicate with the NestJS backend.
 * - Return the requested task.
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

/**
 * ============================================================================
 * Get Task Response
 * ============================================================================
 */

interface GetTaskResponse {
  readonly success: boolean;

  readonly message: string;

  readonly data: Task;
}

/**
 * ============================================================================
 * Get Task
 * ============================================================================
 */

export async function getTask(id: string): Promise<Task> {
  const { data } = await nestjsClient.get<GetTaskResponse>(NESTJS_ROUTES.TASKS.BY_ID(id));

  return data.data;
}
