import type { ComponentType } from 'react';

import {
  Activity,
  AlarmClock,
  BarChart3,
  Bell,
  CalendarDays,
  CheckSquare,
  FileText,
  FolderTree,
  LayoutDashboard,
  Settings,
  Tag,
  User,
} from 'lucide-react';

import { ROLES, type UserRole } from './roles';

/**
 * ============================================================================
 * Application Routes
 * ============================================================================
 */

export const APP_ROUTES = {
  HOME: '/',

  LOGIN: '/login',

  REGISTER: '/register',

  DASHBOARD: '/dashboard',

  NOTES: '/notes',

  TASKS: '/tasks',

  CATEGORIES: '/categories',

  TAGS: '/tags',

  REMINDERS: '/reminders',

  NOTIFICATIONS: '/notifications',

  ANALYTICS: '/analytics',

  ACTIVITY_LOGS: '/activity-logs',

  CALENDAR: '/calendar',

  PROFILE: '/profile',

  SETTINGS: '/settings',
} as const;

/**
 * ============================================================================
 * Navigation Types
 * ============================================================================
 */

export interface NavigationItem {
  readonly title: string;

  readonly href: string;

  readonly icon: ComponentType<{
    className?: string;
  }>;

  readonly roles: readonly UserRole[];
}

/**
 * ============================================================================
 * Sidebar Navigation
 * ============================================================================
 */

export const navigation: readonly NavigationItem[] = [
  {
    title: 'Dashboard',
    href: APP_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN, ROLES.USER],
  },

  {
    title: 'Notes',
    href: APP_ROUTES.NOTES,
    icon: FileText,
    roles: [ROLES.ADMIN, ROLES.USER],
  },

  {
    title: 'Tasks',
    href: APP_ROUTES.TASKS,
    icon: CheckSquare,
    roles: [ROLES.ADMIN, ROLES.USER],
  },

  {
    title: 'Categories',
    href: APP_ROUTES.CATEGORIES,
    icon: FolderTree,
    roles: [ROLES.ADMIN],
  },

  {
    title: 'Tags',
    href: APP_ROUTES.TAGS,
    icon: Tag,
    roles: [ROLES.ADMIN],
  },

  {
    title: 'Reminders',
    href: APP_ROUTES.REMINDERS,
    icon: AlarmClock,
    roles: [ROLES.ADMIN, ROLES.USER],
  },

  {
    title: 'Notifications',
    href: APP_ROUTES.NOTIFICATIONS,
    icon: Bell,
    roles: [ROLES.ADMIN, ROLES.USER],
  },

  {
    title: 'Analytics',
    href: APP_ROUTES.ANALYTICS,
    icon: BarChart3,
    roles: [ROLES.ADMIN],
  },

  {
    title: 'Activity Logs',
    href: APP_ROUTES.ACTIVITY_LOGS,
    icon: Activity,
    roles: [ROLES.ADMIN],
  },

  {
    title: 'Calendar',
    href: APP_ROUTES.CALENDAR,
    icon: CalendarDays,
    roles: [ROLES.ADMIN, ROLES.USER],
  },

  {
    title: 'Profile',
    href: APP_ROUTES.PROFILE,
    icon: User,
    roles: [ROLES.ADMIN, ROLES.USER],
  },

  {
    title: 'Settings',
    href: APP_ROUTES.SETTINGS,
    icon: Settings,
    roles: [ROLES.ADMIN, ROLES.USER],
  },
] as const;

/**
 * ============================================================================
 * Route Groups
 * ============================================================================
 */

export const PUBLIC_ROUTES = [APP_ROUTES.HOME, APP_ROUTES.LOGIN, APP_ROUTES.REGISTER] as const;

export const AUTH_ROUTES = [APP_ROUTES.LOGIN, APP_ROUTES.REGISTER] as const;

export const PROTECTED_ROUTES = [
  APP_ROUTES.DASHBOARD,

  APP_ROUTES.NOTES,

  APP_ROUTES.TASKS,

  APP_ROUTES.CATEGORIES,

  APP_ROUTES.TAGS,

  APP_ROUTES.REMINDERS,

  APP_ROUTES.NOTIFICATIONS,

  APP_ROUTES.ANALYTICS,

  APP_ROUTES.ACTIVITY_LOGS,

  APP_ROUTES.CALENDAR,

  APP_ROUTES.PROFILE,

  APP_ROUTES.SETTINGS,
] as const;
