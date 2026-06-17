'use client';

import Link from 'next/link';

import {
  CalendarDays,
  FolderKanban,
  Inbox,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

import { Task } from '../types/task.types';

import { TaskActions } from './task-actions';
import { TaskPriorityBadge } from './task-priority-badge';
import { TaskStatusBadge } from './task-status-badge';

interface TasksTableProps {
  tasks: Task[];
}

export function TasksTable({
  tasks,
}: TasksTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-lg">
      {/* Header Accent */}
      <div className="h-1 bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500" />

      {/* Divider */}
      <div className="h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/20 hover:bg-transparent">
              <TableHead className="h-14 font-semibold text-slate-700">
                Title
              </TableHead>

              <TableHead className="font-semibold text-slate-700">
                Status
              </TableHead>

              <TableHead className="font-semibold text-slate-700">
                Priority
              </TableHead>

              <TableHead className="font-semibold text-slate-700">
                Category
              </TableHead>

              <TableHead className="font-semibold text-slate-700">
                Due Date
              </TableHead>

              <TableHead className="text-right font-semibold text-slate-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-72"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
                      <Inbox className="h-8 w-8 text-slate-400" />
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900">
                      No Tasks Found
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-slate-500">
                      No tasks match the current filters.
                      Create a new task or adjust your
                      search criteria.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="border-white/10 transition-all duration-300 hover:bg-slate-50/80"
                >
                  {/* Title */}
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="font-medium text-slate-900 transition-colors hover:text-cyan-600"
                      >
                        {task.title}
                      </Link>

                      <p className="text-xs text-slate-400">
                        Task #{task.id}
                      </p>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <TaskStatusBadge
                      status={task.status}
                    />
                  </TableCell>

                  {/* Priority */}
                  <TableCell>
                    <TaskPriorityBadge
                      priority={task.priority}
                    />
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    {task.category ? (
                      <Badge className="gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-cyan-600 hover:bg-cyan-500/10">
                        <FolderKanban className="h-3.5 w-3.5" />
                        {task.category.name}
                      </Badge>
                    ) : (
                      <span className="text-sm text-slate-400">
                        —
                      </span>
                    )}
                  </TableCell>

                  {/* Due Date */}
                  <TableCell>
                    {task.dueDate ? (
                      <Badge
                        variant="outline"
                        className="rounded-2xl border-slate-200 bg-slate-50 text-slate-600"
                      >
                        <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                        {new Date(
                          task.dueDate,
                        ).toLocaleDateString()}
                      </Badge>
                    ) : (
                      <span className="text-sm text-slate-400">
                        —
                      </span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <TaskActions
                      task={task}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}