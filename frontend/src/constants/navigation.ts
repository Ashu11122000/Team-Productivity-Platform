import { LayoutDashboard, FileText, CheckSquare, BarChart3, Bell, Settings } from 'lucide-react';

export const navigation = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Notes',
        href: '/notes',
        icon: FileText,
    },
    {
        title: 'Tasks',
        href: '/tasks',
        icon: CheckSquare,
    },
    {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];