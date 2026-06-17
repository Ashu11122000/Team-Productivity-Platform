'use client';

import Link from 'next/link';

import {
  CalendarDays,
  FolderOpen,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Task } from '../types/task.types';

import { TaskStatusBadge } from './task-status-badge';
import { TaskPriorityBadge } from '@/features/tasks/components/task-priority-badge';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({
  task,
}: TaskCardProps) {
  const dueDate = task.dueDate
    ? new Date(
        task.dueDate,
      ).toLocaleDateString()
    : null;

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block"
    >
      <Card className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:shadow-xl">
        {/* Top Accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500" />

        {/* Ambient Glow */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-violet-400/10 blur-3xl" />
        </div>

        <CardContent className="relative p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-slate-900">
                {task.title}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Task #{task.id}
              </p>
            </div>

            <TaskStatusBadge
              status={task.status}
            />
          </div>

          {/* Description */}
          {task.description && (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
              {task.description}
            </p>
          )}

          {/* Category */}
          {task.category && (
            <div className="mt-4">
              <Badge className="gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-cyan-600 hover:bg-cyan-500/10">
                <FolderOpen className="h-3.5 w-3.5" />
                {task.category.name}
              </Badge>
            </div>
          )}

          {/* Divider */}
          <div className="my-4 h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TaskPriorityBadge
              priority={task.priority}
            />

            <Badge
              variant="outline"
              className="rounded-2xl border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600"
            >
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" />

              {dueDate ??
                'No Due Date'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}