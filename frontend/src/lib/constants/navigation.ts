import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  FolderTree,
  Bell,
  BarChart3,
  Activity,
  Settings,
} from "lucide-react";

import { ROLES, type UserRole } from "./roles";

export interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  roles: UserRole[];
}

export const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN, ROLES.MEMBER],
  },

  {
    title: "Notes",
    href: "/notes",
    icon: FileText,
    roles: [ROLES.ADMIN, ROLES.MEMBER],
  },

  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    roles: [ROLES.ADMIN, ROLES.MEMBER],
  },

  {
    title: "Categories",
    href: "/categories",
    icon: FolderTree,
    roles: [ROLES.ADMIN],
  },

  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: [ROLES.ADMIN, ROLES.MEMBER],
  },

  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: [ROLES.ADMIN],
  },

  {
    title: "Activity Logs",
    href: "/activity-logs",
    icon: Activity,
    roles: [ROLES.ADMIN],
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: [ROLES.ADMIN, ROLES.MEMBER],
  },
];