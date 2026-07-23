/**
 * ============================================================================
 * File: features/tasks/api/create-task.ts
 * ============================================================================
 *
 * Create Task API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Create a new task via the NestJS backend.
 * - Return the created task.
 * - Keep the frontend aligned with the NestJS API contract.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Task management is fully owned by the NestJS backend.
 * - Authentication is performed by the FastAPI backend.
 * - The shared NestJS Axios client automatically attaches the JWT.
 * ============================================================================
 */

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';
import { nestjsClient } from '@/services/nestjs/client';

import type { CreateTaskRequest } from '../types/create-task.types';
import type { Task } from '../types/task.types';

/**
 * ============================================================================
 * Create Task Response
 * ============================================================================
 */

interface CreateTaskResponse {
  readonly success: boolean;

  readonly message: string;

  readonly data: Task;
}

/**
 * ============================================================================
 * Create Task
 * ============================================================================
 */

export async function createTask(payload: CreateTaskRequest): Promise<Task> {
  const { data } = await nestjsClient.post<CreateTaskResponse>(NESTJS_ROUTES.TASKS.BASE, payload);

  return data.data;
}
