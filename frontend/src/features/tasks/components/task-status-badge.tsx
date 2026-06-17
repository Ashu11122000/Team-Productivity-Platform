'use client';

import {
  CheckCircle2,
  CircleDashed,
  Loader2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { TaskStatus } from '../types/task.types';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

function getStatusConfig(
  status: TaskStatus,
) {
  switch (status) {
    case 'TODO':
      return {
        label: 'To Do',
        icon: CircleDashed,
        className:
          'border-slate-200 bg-slate-100 text-slate-900',
      };

    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        icon: Loader2,
        className:
          'border-cyan-500/20 bg-cyan-500/10 text-cyan-600',
      };

    case 'COMPLETED':
      return {
        label: 'Completed',
        icon: CheckCircle2,
        className:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
      };

    default:
      return {
        label: status,
        icon: CircleDashed,
        className:
          'border-slate-200 bg-slate-100 text-slate-900',
      };
  }
}

export function TaskStatusBadge({
  status,
}: TaskStatusBadgeProps) {
  const config =
    getStatusConfig(status);

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 rounded-2xl border px-3 py-1 font-medium backdrop-blur-sm ${config.className}`}
    >
      <Icon
        className={`h-3.5 w-3.5 ${
          status === 'IN_PROGRESS'
            ? 'animate-spin'
            : ''
        }`}
      />

      {config.label}
    </Badge>
  );
}