// features/tasks/types/task-query.types.ts

import {
  TaskPriority,
  TaskStatus,
} from './task.types';

export interface TaskQueryParams {
  page?: number;

  limit?: number;

  search?: string;

  status?: TaskStatus;

  priority?: TaskPriority;
}