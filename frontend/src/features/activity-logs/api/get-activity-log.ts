/**
 * ============================================================================
 * File: features/activity-logs/api/get-activity-log.ts
 * ============================================================================
 *
 * Get Activity Log API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch a single activity log.
 * - Communicate with NestJS backend.
 * - Return typed activity log response.
 * ============================================================================
 */

import { nestjsClient } from '@/services/nestjs/client';

import type { ActivityLog } from '../types/activity-log.types';

/**
 * Get Activity Log By ID
 *
 * Endpoint:
 * GET /api/v1/activity-logs/:id
 */
export const getActivityLog = async (id: string): Promise<ActivityLog> => {
  const { data } = await nestjsClient.get<ActivityLog>(`/activity-logs/${id}`);

  return data;
};
