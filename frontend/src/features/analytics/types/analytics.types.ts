export interface TaskStatusAnalytics {
  todo: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface TaskPriorityAnalytics {
  low: number;
  medium: number;
  high: number;
  urgent: number;
}

export interface ProductivityAnalytics {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
}