import type {
  TaskPriority,
  TaskStatus,
} from './task.types';

export interface UpdateTaskRequest {
  title?: string;

  description?: string;

  status?: TaskStatus;

  priority?: TaskPriority;

  dueDate?: string | null;

  categoryId?: string | null;

  tagIds?: string[];
}