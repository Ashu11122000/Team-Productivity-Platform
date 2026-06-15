export type CreateTaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export type CreateTaskPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';

export interface CreateTaskRequest {
  title: string;

  description?: string;

  status?: CreateTaskStatus;

  priority?: CreateTaskPriority;

  dueDate?: string | null;

  categoryId?: string | null;

  tagIds?: string[];
}