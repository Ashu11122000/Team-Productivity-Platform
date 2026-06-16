import type { Note } from '@/features/notes/types/note.types';
import type { Task } from '@/features/tasks/types/task.types';
import type { Notification } from '@/features/notifications/types/notification.types';

export interface AnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalCategories: number;
  totalNotifications: number;
}

export interface CurrentUser {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
}

export interface DashboardData {
  analytics: AnalyticsSummary;
  notes: Note[];
  tasks: Task[];
  notifications: Notification[];
  profile: CurrentUser;
}