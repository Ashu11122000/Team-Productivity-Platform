'use client';

import {
  CheckCircle2,
  CircleDashed,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useUpdateTaskStatus } from '../hooks/use-update-task-status';

import type {
  Task,
  TaskStatus,
} from '../types/task.types';

interface Props {
  task: Task;
}

function getStatusMeta(
  status: TaskStatus,
) {
  switch (status) {
    case 'TODO':
      return {
        label: 'To Do',
        icon: CircleDashed,
        triggerClass:
          'border-slate-200 bg-slate-100 text-slate-900',
      };

    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        icon: Loader2,
        triggerClass:
          'border-cyan-500/20 bg-cyan-500/10 text-cyan-600',
      };

    case 'COMPLETED':
      return {
        label: 'Completed',
        icon: CheckCircle2,
        triggerClass:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
      };

    case 'BLOCKED':
      return {
        label: 'Blocked',
        icon: ShieldAlert,
        triggerClass:
          'border-rose-500/20 bg-rose-500/10 text-rose-600',
      };

    default:
      return {
        label: status,
        icon: CircleDashed,
        triggerClass:
          'border-slate-200 bg-slate-100 text-slate-900',
      };
  }
}

export function TaskStatusSelect({
  task,
}: Props) {
  const {
    mutate,
    isPending,
  } =
    useUpdateTaskStatus();

  const current =
    getStatusMeta(
      task.status,
    );

  const CurrentIcon =
    current.icon;

  return (
    <Select
      value={task.status}
      disabled={isPending}
      onValueChange={(
        value,
      ) =>
        mutate({
          id: task.id,
          status:
            value as TaskStatus,
        })
      }
    >
      <SelectTrigger
        className={`h-10 min-w-[170px] rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:shadow-md ${current.triggerClass}`}
      >
        <div className="flex items-center gap-2">
          <CurrentIcon
            className={`h-4 w-4 ${
              task.status ===
              'IN_PROGRESS'
                ? 'animate-spin'
                : ''
            }`}
          />

          <SelectValue />
        </div>
      </SelectTrigger>

      <SelectContent className="rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl shadow-xl">
        <SelectItem value="TODO">
          <div className="flex items-center gap-2">
            <CircleDashed className="h-4 w-4 text-slate-500" />
            To Do
          </div>
        </SelectItem>

        <SelectItem value="IN_PROGRESS">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 text-cyan-500" />
            In Progress
          </div>
        </SelectItem>

        <SelectItem value="COMPLETED">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Completed
          </div>
        </SelectItem>

        <SelectItem value="BLOCKED">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            Blocked
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}