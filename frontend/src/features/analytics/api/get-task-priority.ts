/**
 * ============================================================================
 * File: features/analytics/api/get-task-priority.ts
 * ============================================================================
 *
 * Task Priority Analytics API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve task priority analytics from the NestJS backend.
 * - Keep the frontend aligned with the NestJS API contract.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Analytics are fully owned by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * - The shared NestJS Axios client automatically attaches the JWT.
 * ============================================================================
 */

import { NESTJS_ROUTES } from '@/lib/constants/api-routes';
import { nestjsClient } from '@/services/nestjs/client';

import type { TaskPriorityAnalytics } from '../types/analytics.types';

/**
 * ============================================================================
 * Task Priority Analytics Response
 * ============================================================================
 */

interface TaskPriorityAnalyticsResponse {
  readonly success: boolean;

  readonly message: string;

  readonly data: TaskPriorityAnalytics;
}

/**
 * ============================================================================
 * Get Task Priority Analytics
 * ============================================================================
 */

export async function getTaskPriorityAnalytics(): Promise<TaskPriorityAnalytics> {
  const { data } = await nestjsClient.get<TaskPriorityAnalyticsResponse>(
    `${NESTJS_ROUTES.ANALYTICS.TASKS}/priority`,
  );

  return data.data;
}
