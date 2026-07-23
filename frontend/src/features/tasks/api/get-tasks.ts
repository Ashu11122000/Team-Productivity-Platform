/**
 * ============================================================================
 * File: features/tasks/api/get-tasks.ts
 * ============================================================================
 *
 * Get Tasks API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve paginated tasks from the NestJS backend.
 * - Support filtering, searching, sorting, and pagination.
 * - Return the paginated task response.
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

import type { TaskQueryParams } from '../types/task-query.types';
import type { TasksResponse } from '../types/task.types';

/**
 * ============================================================================
 * Get Tasks
 * ============================================================================
 */

export async function getTasks(params?: TaskQueryParams): Promise<TasksResponse> {
  const { data } = await nestjsClient.get<TasksResponse>(NESTJS_ROUTES.TASKS.BASE, {
    params,
  });

  return data;
}
