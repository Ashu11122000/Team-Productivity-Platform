/**
 * ============================================================================
 * File: features/activity-logs/hooks/use-activity-logs.ts
 * ============================================================================
 *
 * Activity Logs Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch activity logs.
 * - Use centralized React Query keys.
 * - Support filters and pagination.
 * - Provide typed responses.
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';

import { getActivityLogs } from '../api/get-activity-logs';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

import type { ActivityLogQueryParams } from '../types/activity-log-query.types';

import type { ActivityLogsResponse } from '../types/activity-log.types';

export const useActivityLogs = (params?: ActivityLogQueryParams) => {
  return useQuery<ActivityLogsResponse>({
    queryKey: QUERY_KEYS.activityLogList(params),

    queryFn: () => getActivityLogs(),
  });
};
