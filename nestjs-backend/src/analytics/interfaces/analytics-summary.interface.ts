/***
 * ============================================================================
 * File: analytics-summary.interface.ts
 * ============================================================================
 *
 * Analytics Summary Interface.
 *
 * Responsibilities
 * ----------------
 * - Define the internal analytics aggregation contract.
 * - Represent repository aggregation results.
 * - Decouple repositories from API response DTOs.
 * - Serve as the input model for AnalyticsMapper.
 *
 * Notes
 * -----
 * - Internal use only.
 * - Never returned directly by controllers.
 * - Contains no Swagger decorators.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

import { TaskPriority } from '../../common/enums/task-priority.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';

export interface AnalyticsSummary {
  overview: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
    totalCategories: number;
    totalTags: number;
    totalNotifications: number;
  };

  productivity: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    completionRate: number;
  };

  summary: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    cancelledTasks: number;
    completionRate: number;
  };

  taskStatusStats: Array<{
    status: TaskStatus;
    count: number;
  }>;

  taskPriorityStats: Array<{
    priority: TaskPriority;
    count: number;
  }>;

  productivityTrend: Array<{
    period: string;
    tasksCreated: number;
    tasksCompleted: number;
    overdueTasks: number;
    productivityRate: number;
  }>;

  generatedAt: Date;
}
