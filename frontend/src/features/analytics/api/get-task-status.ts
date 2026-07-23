/**
 * ============================================================================
 * File: features/analytics/api/get-task-status.ts
 * ============================================================================
 *
 * Task Status Analytics API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve task status analytics from the NestJS backend.
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

import type { TaskStatusAnalytics } from '../types/analytics.types';

/**
 * ============================================================================
 * Task Status Analytics Response
 * ============================================================================
 */

interface TaskStatusAnalyticsResponse {
  readonly success: boolean;

  readonly message: string;

  readonly data: TaskStatusAnalytics;
}

/**
 * ============================================================================
 * Get Task Status Analytics
 * ============================================================================
 */

export async function getTaskStatusAnalytics(): Promise<TaskStatusAnalytics> {
  const { data } = await nestjsClient.get<TaskStatusAnalyticsResponse>(
    `${NESTJS_ROUTES.ANALYTICS.TASKS}/status`,
  );

  return data.data;
}
