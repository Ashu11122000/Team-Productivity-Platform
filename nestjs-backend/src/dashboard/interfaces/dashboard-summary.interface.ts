/*
 * ============================================================================
 * File: dashboard-summary.interface.ts
 * ============================================================================
 *
 * Enterprise Dashboard Summary Interface
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Represents the complete dashboard summary returned by the repository.
 * - Acts as the internal business contract between Repository and Service.
 * - Aggregates all dashboard sections.
 * - Remains independent of DTOs, HTTP, and persistence concerns.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Clean Architecture
 * - Strong Typing
 * - Interface Segregation Principle (ISP)
 * - Framework Agnostic
 *
 * Compatible With
 * ----------------------------------------------------------------------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

export interface DashboardOverview {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  cancelledTasks: number;
  completionRate: number;
  totalCategories: number;
  totalTags: number;
  unreadNotifications: number;
  upcomingReminders: number;
}

export interface DashboardTrendPoint {
  label: string;
  created: number;
  completed: number;
}

export interface DashboardProductivity {
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  averageCompletedPerDay: number;
  completedThisWeek: number;
  completedThisMonth: number;
  trend: DashboardTrendPoint[];
}

export interface DashboardCalendarItem {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  overdue: boolean;
}

export interface DashboardCalendar {
  totalEvents: number;
  upcomingEvents: DashboardCalendarItem[];
}

export interface DashboardNotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

export interface DashboardNotification {
  unreadCount: number;
  notifications: DashboardNotificationItem[];
}

export interface DashboardSummary {
  overview: DashboardOverview;

  productivity: DashboardProductivity;

  calendar: DashboardCalendar;

  notifications: DashboardNotification;
}
