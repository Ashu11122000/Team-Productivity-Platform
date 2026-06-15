'use client';

import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useTask } from '@/features/tasks/hooks/use-task';

import { UpdateTaskDialog } from '@/features/tasks/components/update-task-dialog';
import { DeleteTaskDialog } from '@/features/tasks/components/delete-task-dialog';
import { TaskStatusSelect } from '@/features/tasks/components/task-status-select';

interface TaskDetailsPageProps {
  params: {
    id: string;
  };
}

export default function TaskDetailsPage({
  params,
}: TaskDetailsPageProps) {
  const [editOpen, setEditOpen] =
    useState(false);

  const {
    data: task,
    isLoading,
    isError,
  } = useTask(params.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />

        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border p-6">
        Failed to load task.
      </div>
    );
  }

  if (!task) {
    return (
      <div className="rounded-md border p-6">
        Task not found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {task.title}
            </h1>

            <p className="text-muted-foreground">
              Task Details
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                setEditOpen(true)
              }
            >
              Edit Task
            </Button>

            <DeleteTaskDialog
              taskId={task.id}
            />
          </div>
        </div>

        <Card>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="mb-2 text-sm font-medium">
                Status
              </h3>

              <TaskStatusSelect
                task={task}
              />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">
                Priority
              </h3>

              <p>
                {task.priority}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">
                Description
              </h3>

              <p className="text-muted-foreground">
                {task.description ||
                  'No description provided'}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">
                Due Date
              </h3>

              <p>
                {task.dueDate
                  ? new Date(
                      task.dueDate,
                    ).toLocaleString()
                  : 'No due date'}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">
                Created At
              </h3>

              <p>
                {new Date(
                  task.createdAt,
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">
                Last Updated
              </h3>

              <p>
                {new Date(
                  task.updatedAt,
                ).toLocaleString()}
              </p>
            </div>

            {task.isConvertedFromNote && (
              <div>
                <h3 className="mb-2 text-sm font-medium">
                  Source Note
                </h3>

                <p>
                  Converted from Note ID:{' '}
                  {task.sourceNoteId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
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