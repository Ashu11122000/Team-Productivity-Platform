/**
 * ============================================================================
 * File: features/analytics/api/get-productivity.ts
 * ============================================================================
 *
 * Productivity Analytics API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Retrieve productivity analytics from the NestJS backend.
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

import type { ProductivityAnalytics } from '../types/analytics.types';

/**
 * ============================================================================
 * Productivity Analytics Response
 * ============================================================================
 */

interface ProductivityAnalyticsResponse {
  readonly success: boolean;

  readonly message: string;

  readonly data: ProductivityAnalytics;
}

/**
 * ============================================================================
 * Get Productivity Analytics
 * ============================================================================
 */

export async function getProductivityAnalytics(): Promise<ProductivityAnalytics> {
  const { data } = await nestjsClient.get<ProductivityAnalyticsResponse>(
    NESTJS_ROUTES.ANALYTICS.PRODUCTIVITY,
  );

  return data.data;
}
