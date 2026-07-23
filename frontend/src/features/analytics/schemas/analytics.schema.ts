/**
 * ============================================================================
 * File: features/analytics/schemas/task-analytics.schema.ts
 * ============================================================================
 *
 * Task Analytics Validation Schemas
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Validate analytics responses from the NestJS backend.
 * - Mirror backend analytics DTOs.
 * - Provide strongly typed analytics models.
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - Analytics are owned by the NestJS backend.
 * - Used for runtime validation of API responses.
 * ============================================================================
 */

import { z } from 'zod';

/**
 * ============================================================================
 * Task Status Analytics
 * ============================================================================
 */

export const taskStatusAnalyticsSchema = z.object({
  TODO: z.number(),

  IN_PROGRESS: z.number(),

  COMPLETED: z.number(),
});

/**
 * ============================================================================
 * Task Priority Analytics
 * ============================================================================
 */

export const taskPriorityAnalyticsSchema = z.object({
  LOW: z.number(),

  MEDIUM: z.number(),

  HIGH: z.number(),
});

/**
 * ============================================================================
 * Productivity Analytics
 * ============================================================================
 */

export const productivityAnalyticsSchema = z.object({
  totalTasks: z.number(),

  completedTasks: z.number(),

  activeTasks: z.number(),

  completionRate: z.number(),
});

/**
 * ============================================================================
 * Schema Types
 * ============================================================================
 */

export type TaskStatusAnalyticsSchema = z.infer<typeof taskStatusAnalyticsSchema>;

export type TaskPriorityAnalyticsSchema = z.infer<typeof taskPriorityAnalyticsSchema>;

export type ProductivityAnalyticsSchema = z.infer<typeof productivityAnalyticsSchema>;
