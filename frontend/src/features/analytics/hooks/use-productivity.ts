'use client';

/**
 * ============================================================================
 * File: features/analytics/hooks/use-productivity.ts
 * ============================================================================
 *
 * Productivity Analytics Query Hook
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Fetch productivity analytics from the NestJS backend.
 * - Cache analytics using TanStack Query.
 * - Provide optimized caching for dashboard data.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Analytics are fully owned by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';

import { getProductivityAnalytics } from '../api/get-productivity';
import type { ProductivityAnalytics } from '../types/analytics.types';

import { QUERY_KEYS } from '@/lib/constants/query-keys';

/**
 * ============================================================================
 * Cache Configuration
 * ============================================================================
 */

export const PRODUCTIVITY_STALE_TIME = 5 * 60 * 1000;

export const PRODUCTIVITY_GC_TIME = 30 * 60 * 1000;

/**
 * ============================================================================
 * Productivity Analytics Query
 * ============================================================================
 */

export function useProductivity() {
  return useQuery<ProductivityAnalytics>({
    queryKey: QUERY_KEYS.productivityAnalytics,

    queryFn: getProductivityAnalytics,

    staleTime: PRODUCTIVITY_STALE_TIME,

    gcTime: PRODUCTIVITY_GC_TIME,

    retry: 1,

    refetchOnWindowFocus: false,
  });
}
