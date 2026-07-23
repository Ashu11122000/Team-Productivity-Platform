/**
 * ============================================================================
 * File: features/activity-logs/hooks/use-activity-log.ts
 * ============================================================================
 *
 * Activity Log Detail Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch a single activity log.
 * - Use centralized React Query keys.
 * - Provide typed API responses.
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';

import { getActivityLog } from '../api/get-activity-log';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

import type { ActivityLog } from '../types/activity-log.types';

export const useActivityLog = (id?: string) => {
  return useQuery<ActivityLog>({
    queryKey: QUERY_KEYS.activityLog(id ?? ''),

    queryFn: () => getActivityLog(id as string),

    enabled: Boolean(id),
  });
};
