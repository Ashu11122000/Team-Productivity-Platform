import { z } from 'zod';

export const taskStatusAnalyticsSchema = z.object({
  todo: z.number(),
  inProgress: z.number(),
  completed: z.number(),
  cancelled: z.number(),
});

export const taskPriorityAnalyticsSchema = z.object({
  low: z.number(),
  medium: z.number(),
  high: z.number(),
  urgent: z.number(),
});

export const productivityAnalyticsSchema = z.object({
  totalTasks: z.number(),
  completedTasks: z.number(),
  activeTasks: z.number(),
  completionRate: z.number(),
});

export type TaskStatusAnalyticsSchema = z.infer<
  typeof taskStatusAnalyticsSchema
>;

export type TaskPriorityAnalyticsSchema = z.infer<
  typeof taskPriorityAnalyticsSchema
>;

export type ProductivityAnalyticsSchema = z.infer<
  typeof productivityAnalyticsSchema
>;