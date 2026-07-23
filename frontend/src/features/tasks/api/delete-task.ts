/**
 * ============================================================================
 * File: features/tasks/api/delete-task.ts
 * ============================================================================
 *
 * Delete Task API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Delete an existing task via the NestJS backend.
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

/**
 * ============================================================================
 * Delete Task
 * ============================================================================
 */

export async function deleteTask(id: string): Promise<void> {
  await nestjsClient.delete(NESTJS_ROUTES.TASKS.BY_ID(id));
}
