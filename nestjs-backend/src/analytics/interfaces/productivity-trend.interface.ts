/**
 * ============================================================================
 * File: productivity-trend.interface.ts
 * ============================================================================
 *
 * Internal Productivity Trend Contract.
 *
 * Responsibilities
 * ----------------
 * - Represent productivity metrics for a single reporting period.
 * - Used internally between Repository and Service.
 * - Converted into DTOs by AnalyticsMapper.
 *
 * Notes
 * -----
 * - Internal use only.
 * - No Swagger decorators.
 * - No database concerns.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

export interface ProductivityTrend {
  /**
   * Reporting period.
   *
   * Example:
   * 2026-07-21
   */
  readonly period: string;

  /**
   * Tasks created during the period.
   */
  readonly tasksCreated: number;

  /**
   * Tasks completed during the period.
   */
  readonly tasksCompleted: number;

  /**
   * Overdue tasks during the period.
   */
  readonly overdueTasks: number;

  /**
   * Productivity percentage.
   */
  readonly productivityRate: number;
}
