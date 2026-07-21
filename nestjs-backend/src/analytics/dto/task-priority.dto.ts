import { ApiProperty } from '@nestjs/swagger';

import { TaskPriority } from '../../common/enums/task-priority.enum';

/**
 * ============================================================================
 * File: task-priority.dto.ts
 * ============================================================================
 *
 * Task Priority Distribution DTO.
 *
 * Responsibilities
 * ----------------
 * - Represent a single task priority distribution entry.
 * - Support dashboard charts and analytics reports.
 * - Hide database aggregation results.
 *
 * Returned By
 * -----------
 * - GET /analytics/task-priority
 * - GET /analytics/dashboard
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * ============================================================================
 */
export class TaskPriorityDto {
  @ApiProperty({
    description: 'Task priority.',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
  })
  readonly priority!: TaskPriority;

  @ApiProperty({
    description: 'Number of tasks with this priority.',
    example: 18,
  })
  readonly count!: number;
}
