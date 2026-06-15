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
  const [open, setOpen] =
    useState(false);

  const { mutate, isPending } =
    useCreateTask();

  const form =
    useForm<CreateTaskSchemaType>({
      resolver: zodResolver(
        createTaskSchema,
      ),

      defaultValues: {
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
      },
    });

  const onSubmit = (
    values: CreateTaskSchemaType,
  ) => {
    mutate(values, {
      onSuccess: () => {
        form.reset();

        setOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          Create Task
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Task
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
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}