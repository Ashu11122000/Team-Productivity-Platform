export const QUERY_KEYS = {
  currentUser: ['current-user'] as const,

  notes: ['notes'] as const,

  note: (id: string) => ['notes', id] as const,

  tasks: ['tasks'] as const,

  task: (id: string) => ['tasks', id] as const,

  categories: ['categories'] as const,

  notifications: ['notifications'] as const,

  analytics: ['analytics'] as const,

  taskStatusAnalytics: ['task-status-analytics'] as const,

  taskPriorityAnalytics: ['task-priority-analytics'] as const,

  productivityAnalytics: ['productivity-analytics'] as const,

  profile: ['profile'] as const,

  preferences: ['preferences'] as const,
};
