'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import {
  Loader2,
  PencilLine,
} from 'lucide-react';

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
  const {
    mutate,
    isPending,
  } = useUpdateTask();

  const form =
    useForm<TaskFormValues>({
      resolver:
        zodResolver(
          taskSchema,
        ),

      defaultValues: {
        title: task.title,
        description:
          task.description ??
          '',
        status:
          task.status,
        priority:
          task.priority,
        dueDate:
          task.dueDate ??
          '',
        categoryId:
          task.categoryId,
        tagIds: [],
      },
    });

  useEffect(() => {
    form.reset({
      title: task.title,
      description:
        task.description ??
        '',
      status:
        task.status,
      priority:
        task.priority,
      dueDate:
        task.dueDate ??
        '',
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
        values.categoryId ??
        undefined,

      tagIds:
        values.tagIds
          ?.length
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
          onOpenChange(
            false,
          );
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
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-linear-to-br from-slate-200/95 via-slate-100/90 to-slate-200/95 backdrop-blur-3xl shadow-[0_25px_80px_rgba(15,23,42,0.25)] sm:max-w-3xl">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-cyan-400/15 blur-[100px]" />

          <div className="absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-violet-400/15 blur-[100px]" />
        </div>

        <DialogHeader className="relative space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-cyan-500 text-white shadow-lg">
              <PencilLine className="h-7 w-7" />
            </div>

            <div>
              <DialogTitle className="bg-linear-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent">
                Update Task
              </DialogTitle>

              <p className="mt-1 text-sm text-slate-500">
                Modify task details,
                status, priority and
                scheduling information.
              </p>
            </div>
          </div>

          {/* Accent Divider */}
          <div className="h-px bg-linear-to-r from-transparent via-cyan-500/70 to-transparent" />
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(
            onSubmit,
          )}
          className="relative mt-2 space-y-8"
        >
          <TaskForm
            form={form}
          />

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/20 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(
                  false,
                )
              }
              className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-xl"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isPending
              }
              className="rounded-2xl bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}