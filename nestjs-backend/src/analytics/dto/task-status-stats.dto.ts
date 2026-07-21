import { ApiProperty } from '@nestjs/swagger';

import { TaskStatus } from '../../common/enums/task-status.enum';

/**
 * ============================================================================
 * File: task-status-stats.dto.ts
 * ============================================================================
 *
 * Task Status Statistics Response DTO.
 *
 * Responsibilities
 * ----------------
 * - Represent the number of tasks for a specific status.
 * - Support dashboard charts and analytics reports.
 * - Hide persistence-layer implementation details.
 *
 * Notes
 * -----
 * Returned by:
 * - GET /analytics/task-status
 * - GET /analytics/dashboard
 *
 * Each instance represents a single task status and its corresponding count.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * ============================================================================
 */

export class TaskStatusStatsDto {
  @ApiProperty({
    description: 'Task status.',
    enum: TaskStatus,
    example: TaskStatus.COMPLETED,
  })
  readonly status!: TaskStatus;

  @ApiProperty({
    description: 'Number of tasks with this status.',
    example: 42,
  })
  readonly count!: number;
}
