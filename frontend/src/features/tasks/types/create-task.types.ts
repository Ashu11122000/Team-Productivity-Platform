export type TaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export type TaskPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';

export interface Task {
  id: string;

  title: string;

  description: string | null;

  status: TaskStatus;

  priority: TaskPriority;

  dueDate: string | null;

  userId: string;

  isConvertedFromNote: boolean;

  sourceNoteId: string | null;

  categoryId: string | null;

  category: unknown | null;

  tags: unknown[];

  createdAt: string;

  updatedAt: string;
}

export interface TasksResponse {
  data: Task[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}