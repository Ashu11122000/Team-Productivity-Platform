import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  FolderTree,
  Bell,
  BarChart3,
  Activity,
  Settings,
} from 'lucide-react';

export const navigation = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'USER'],
  },

  {
    title: 'Notes',
    href: '/notes',
    icon: FileText,
    roles: ['ADMIN', 'USER'],
  },

  {
    title: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
    roles: ['ADMIN', 'USER'],
  },

  {
    title: 'Categories',
    href: '/categories',
    icon: FolderTree,
    roles: ['ADMIN'],
  },

  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['ADMIN', 'USER'],
  },

  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['ADMIN'],
  },

  {
    title: 'Activity Logs',
    href: '/activity-logs',
    icon: Activity,
    roles: ['ADMIN'],
  },

  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN', 'USER'],
  },
];