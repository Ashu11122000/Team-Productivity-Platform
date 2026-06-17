'use client';

import {
  AlertTriangle,
  ArrowDown,
  Minus,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { TaskPriority } from '../types/task.types';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

function getPriorityConfig(
  priority: TaskPriority,
) {
  switch (priority) {
    case 'LOW':
      return {
        label: 'Low',
        icon: ArrowDown,
        className:
          'border-slate-200 bg-slate-100 text-slate-900',
      };

    case 'MEDIUM':
      return {
        label: 'Medium',
        icon: Minus,
        className:
          'border-amber-500/20 bg-amber-500/10 text-amber-600',
      };

    case 'HIGH':
      return {
        label: 'High',
        icon: AlertTriangle,
        className:
          'border-rose-500/20 bg-rose-500/10 text-rose-600',
      };

    default:
      return {
        label: priority,
        icon: Minus,
        className:
          'border-slate-200 bg-slate-100 text-slate-900',
      };
  }
}

export function TaskPriorityBadge({
  priority,
}: TaskPriorityBadgeProps) {
  const config =
    getPriorityConfig(
      priority,
    );

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 rounded-2xl border px-3 py-1 font-medium backdrop-blur-sm ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {config.label}
    </Badge>
  );
}