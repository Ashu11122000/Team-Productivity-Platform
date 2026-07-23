/**
 * ============================================================================
 * File: features/analytics/constants/analytics.constants.ts
 * ============================================================================
 *
 * Analytics Constants
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Centralize analytics configuration.
 * - Configure React Query cache behavior.
 * - Store reusable chart/dashboard constants.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Analytics data is managed by the NestJS backend.
 * - Authentication is handled by the FastAPI backend.
 * ============================================================================
 */

/**
 * ============================================================================
 * React Query Cache Configuration
 * ============================================================================
 */

/**
 * Analytics data does not change every second.
 * Keep it fresh for 5 minutes.
 */
export const ANALYTICS_STALE_TIME = 5 * 60 * 1000;

/**
 * Keep analytics cache available for 30 minutes.
 */
export const ANALYTICS_GC_TIME = 30 * 60 * 1000;

/**
 * ============================================================================
 * Dashboard Chart Configuration
 * ============================================================================
 */

/**
 * Default chart height.
 */
export const DEFAULT_ANALYTICS_CHART_HEIGHT = 320;

/**
 * Default animation duration for charts.
 */
export const ANALYTICS_CHART_ANIMATION_DURATION = 800;

/**
 * ============================================================================
 * Task Status Labels
 * ============================================================================
 */

export const TASK_STATUS_LABELS = {
  TODO: 'To Do',

  IN_PROGRESS: 'In Progress',

  COMPLETED: 'Completed',
} as const;

/**
 * ============================================================================
 * Task Priority Labels
 * ============================================================================
 */

export const TASK_PRIORITY_LABELS = {
  LOW: 'Low',

  MEDIUM: 'Medium',

  HIGH: 'High',
} as const;

/**
 * ============================================================================
 * Analytics Messages
 * ============================================================================
 */

export const ANALYTICS_MESSAGES = {
  FETCH_ERROR: 'Failed to load analytics data.',

  EMPTY_DATA: 'No analytics data available.',
} as const;
