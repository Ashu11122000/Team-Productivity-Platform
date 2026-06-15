'use client';

import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import { useTasks } from '@/features/tasks/hooks/use-tasks';

import { TasksFilters } from '@/features/tasks/components/tasks-filters';
import { TasksTable } from '@/features/tasks/components/tasks-table';
import { CreateTaskDialog } from '@/features/tasks/components/create-task-dialog';

export default function TasksPage() {
  const [search, setSearch] =
    useState('');

  const {
    data,
    isLoading,
    isError,
  } = useTasks({
    search,
  });

  const tasks =
    data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        Failed to load tasks.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Tasks
          </h1>

          <p className="text-muted-foreground">
            Manage your tasks
          </p>
        </div>

        <CreateTaskDialog />
      </div>

      <TasksFilters
        search={search}
        onSearchChange={setSearch}
      />

      <TasksTable tasks={tasks} />
    </div>
  );
}