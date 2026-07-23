/**
 * ============================================================================
 * File: features/activity-logs/api/get-activity-logs.ts
 * ============================================================================
 *
 * Get Activity Logs API
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch activity logs from NestJS backend.
 * - Support pagination and filtering.
 * - Return typed activity log response.
 * ============================================================================
 */

import { nestjsClient } from '@/services/nestjs/client';

import type { ActivityLogsResponse } from '../types/activity-log.types';

import type { ActivityLogQueryParams } from '../types/activity-log-query.types';

export const getActivityLogs = async (
  params?: ActivityLogQueryParams,
): Promise<ActivityLogsResponse> => {
  const { data } = await nestjsClient.get<ActivityLogsResponse>('/activity-logs', {
    params,
  });

  return data;
};
