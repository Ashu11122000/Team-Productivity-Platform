'use client';

import { use, useState } from 'react';

import {
  CalendarDays,
  Clock3,
  FileText,
  FolderKanban,
  PencilLine,
  Sparkles,
} from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useTask } from '@/features/tasks/hooks/use-task';

import { UpdateTaskDialog } from '@/features/tasks/components/update-task-dialog';
import { DeleteTaskDialog } from '@/features/tasks/components/delete-task-dialog';
import { TaskStatusSelect } from '@/features/tasks/components/task-status-select';
import { TaskPriorityBadge } from '@/features/tasks/components/task-priority-badge';
import { TaskStatusBadge } from '@/features/tasks/components/task-status-badge';

interface TaskDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TaskDetailsPage({
  params,
}: TaskDetailsPageProps) {
  const { id } = use(params);

  const [editOpen, setEditOpen] =
    useState(false);

  const {
    data: task,
    isLoading,
    isError,
  } = useTask(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-3xl" />

        <Skeleton className="h-[500px] rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <h2 className="text-xl font-semibold text-rose-600">
          Failed to load task
        </h2>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/70 p-8 text-center backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-slate-900">
          Task not found
        </h2>
      </div>
    );
  }

  return (
    <>
      <div className="relative space-y-8">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-[140px]" />

          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-400/10 blur-[140px]" />
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-slate-200/90 via-slate-100/85 to-slate-200/90 p-8 backdrop-blur-3xl shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white">
                <Sparkles className="h-4 w-4" />
                Task Workspace
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                  {task.title}
                </h1>

                <p className="mt-2 text-slate-500">
                  Detailed task overview,
                  status management and
                  planning workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <TaskStatusBadge
                  status={task.status}
                />

                <TaskPriorityBadge
                  priority={
                    task.priority
                  }
                />

                {task.category && (
                  <Badge className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600">
                    {task.category.name}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  setEditOpen(
                    true,
                  )
                }
                className="rounded-2xl bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500 text-white shadow-lg"
              >
                <PencilLine className="mr-2 h-4 w-4" />
                Edit Task
              </Button>

              <DeleteTaskDialog
                taskId={task.id}
                taskTitle={
                  task.title
                }
              />
            </div>
          </div>

          <div className="mt-6 h-px bg-linear-to-r from-transparent via-cyan-500/70 to-transparent" />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Details */}
          <Card className="lg:col-span-2 rounded-3xl border-white/20 bg-white/70 backdrop-blur-xl shadow-lg">
            <CardContent className="space-y-8 p-8">
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <FileText className="h-5 w-5 text-violet-500" />
                  Description
                </h3>

                <p className="leading-7 text-slate-600">
                  {task.description ||
                    'No description provided.'}
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Status Management
                </h3>

                <TaskStatusSelect
                  task={task}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <Card className="rounded-3xl border-white/20 bg-white/70 backdrop-blur-xl shadow-lg">
            <CardContent className="space-y-6 p-8">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Task Information
                </h3>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Due Date
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-cyan-500" />

                      <span className="text-sm text-slate-700">
                        {task.dueDate
                          ? new Date(
                              task.dueDate,
                            ).toLocaleString()
                          : 'No due date'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Created
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-indigo-500" />

                      <span className="text-sm text-slate-700">
                        {new Date(
                          task.createdAt,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Last Updated
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-violet-500" />

                      <span className="text-sm text-slate-700">
                        {new Date(
                          task.updatedAt,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {task.isConvertedFromNote && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Source Note
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-cyan-500" />

                        <span className="text-sm text-slate-700">
                          Note ID:{' '}
                          {task.sourceNoteId}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UpdateTaskDialog
        open={editOpen}
        onOpenChange={
          setEditOpen
        }
        task={task}
      />
    </>
  );
}