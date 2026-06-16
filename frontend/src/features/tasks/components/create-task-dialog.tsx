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

import { TaskForm } from './task-form';

import {
  createTaskSchema,
  CreateTaskSchemaType,
} from '../schemas/create-task.schema';

import { useCreateTask } from '../hooks/use-create-task';

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useCreateTask();

  const form = useForm<CreateTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),

    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
      categoryId: null,
      tagIds: [],
    },
  });

  const onSubmit = (values: CreateTaskSchemaType) => {
    const payload = {
      ...values,

      dueDate: values.dueDate?.trim() ? values.dueDate : undefined,

      categoryId: values.categoryId ?? undefined,

      tagIds: values.tagIds?.length ? values.tagIds : undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        form.reset({
          title: '',
          description: '',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: '',
          categoryId: null,
          tagIds: [],
        });

        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Task</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TaskForm form={form} />

          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
