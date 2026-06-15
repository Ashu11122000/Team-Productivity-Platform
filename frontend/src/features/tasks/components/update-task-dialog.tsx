'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import { Task } from '../types/task.types';

import { TaskForm } from './task-form';

import {
  updateTaskSchema,
  UpdateTaskSchemaType,
} from '../schemas/update-task.schema';

import { useUpdateTask } from '../hooks/use-update-task';

interface UpdateTaskDialogProps {
  task: Task;
}

export function UpdateTaskDialog({
  task,
}: UpdateTaskDialogProps) {
  const [open, setOpen] =
    useState(false);

  const { mutate, isPending } =
    useUpdateTask();

  const form =
    useForm<UpdateTaskSchemaType>({
      resolver: zodResolver(
        updateTaskSchema,
      ),

      defaultValues: {
        title: task.title,
        description:
          task.description ?? '',
        status: task.status,
        priority: task.priority,
        dueDate:
          task.dueDate ?? '',
      },
    });

  const onSubmit = (
    values: UpdateTaskSchemaType,
  ) => {
    mutate(
      {
        id: task.id,
        data: values,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update Task
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(
            onSubmit,
          )}
          className="space-y-4"
        >
          <TaskForm form={form as any} />

          <Button
            type="submit"
            disabled={isPending}
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}