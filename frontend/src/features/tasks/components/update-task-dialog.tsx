'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import { TaskForm } from './task-form';

import {
  taskSchema,
  TaskFormValues,
} from '../schemas/task.schema';

import { Task } from '../types/task.types';

import { useUpdateTask } from '../hooks/use-update-task';

interface UpdateTaskDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  task: Task;
}

export function UpdateTaskDialog({
  open,
  onOpenChange,
  task,
}: UpdateTaskDialogProps) {
  const { mutate, isPending } =
    useUpdateTask();

  const form =
    useForm<TaskFormValues>({
      resolver:
        zodResolver(taskSchema),

      defaultValues: {
        title: task.title,
        description:
          task.description ?? '',
        status: task.status,
        priority:
          task.priority,
        dueDate:
          task.dueDate ?? '',
        categoryId:
          task.categoryId,
        tagIds: [],
      },
    });

  useEffect(() => {
    form.reset({
      title: task.title,
      description:
        task.description ?? '',
      status: task.status,
      priority:
        task.priority,
      dueDate:
        task.dueDate ?? '',
      categoryId:
        task.categoryId,
      tagIds: [],
    });
  }, [task, form]);

const onSubmit = (
  values: TaskFormValues,
) => {
  const payload = {
    ...values,

    dueDate:
      values.dueDate?.trim()
        ? values.dueDate
        : undefined,

    categoryId:
      values.categoryId ?? undefined,

    tagIds:
      values.tagIds?.length
        ? values.tagIds
        : undefined,
  };

  mutate(
    {
      id: task.id,
      payload,
    },
    {
      onSuccess: () => {
        onOpenChange(false);
      },
    },
  );
};

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
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
          <TaskForm form={form} />

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