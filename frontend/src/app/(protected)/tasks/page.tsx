'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  LayoutGrid,
  ListTodo,
  Sparkles,
} from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

import { useTasks } from '@/features/tasks/hooks/use-tasks';

import { TasksFilters } from '@/features/tasks/components/tasks-filters';
import { TasksTable } from '@/features/tasks/components/tasks-table';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';

import type {
  TaskPriority,
  TaskStatus,
} from '@/features/tasks/types/task.types';

export default function TasksPage() {
  const [search, setSearch] =
    useState('');

  const [status, setStatus] =
    useState<
      TaskStatus | undefined
    >();

  const [priority, setPriority] =
    useState<
      TaskPriority | undefined
    >();

  const {
    data,
    isLoading,
    isError,
  } = useTasks({
    search,
    status,
    priority,
  });

  const tasks =
    data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-3xl" />

        <Skeleton className="h-32 rounded-3xl" />

        <Skeleton className="h-[500px] rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <h2 className="text-xl font-semibold text-rose-600">
          Failed to load tasks
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-[160px]" />

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-400/10 blur-[160px]" />

        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-400/10 blur-[160px]" />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-slate-200/90 via-slate-100/85 to-slate-200/90 p-8 backdrop-blur-3xl shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
              <Sparkles className="h-4 w-4" />
              Tasks Workspace
            </div>

            <div>
              <h1 className="bg-linear-to-r from-slate-900 via-indigo-700 to-cyan-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                Tasks
              </h1>

              <p className="mt-2 text-slate-500">
                Manage projects, track progress and
                organize work across your team.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/tasks/kanban">
              <Button
                variant="outline"
                className="rounded-2xl border-white/20 bg-white/70 backdrop-blur-xl"
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Kanban View
              </Button>
            </Link>

            <CreateTaskDialog />
          </div>
        </div>

        <div className="mt-6 h-px bg-linear-to-r from-transparent via-cyan-500/70 to-transparent" />

        {/* KPI Cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/20 bg-white/60 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                <ListTodo className="h-5 w-5 text-cyan-600" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Total Tasks
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {tasks.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/60 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Active Filters
            </p>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {(status ? 1 : 0) +
                (priority
                  ? 1
                  : 0)}
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/60 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              View Mode
            </p>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              Table View
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TasksFilters
        search={search}
        status={status}
        priority={priority}
        onSearchChange={
          setSearch
        }
        onStatusChange={
          setStatus
        }
        onPriorityChange={
          setPriority
        }
      />

      {/* Table */}
      <TasksTable
        tasks={tasks}
      />
    </div>
  );
}