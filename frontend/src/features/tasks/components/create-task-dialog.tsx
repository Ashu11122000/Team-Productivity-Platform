'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Sparkles } from 'lucide-react';

import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

      dueDate: values.dueDate?.trim()
        ? values.dueDate
        : undefined,

      categoryId:
        values.categoryId ?? undefined,

      tagIds:
        values.tagIds?.length
          ? values.tagIds
          : undefined,
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
        <Button
          className="
            rounded-2xl
            bg-linear-to-r
            from-indigo-500
            via-violet-500
            to-cyan-500
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-xl
          "
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          max-w-2xl
          overflow-hidden
          rounded-3xl
          border-white/20

          bg-linear-to-br
          from-slate-200/95
          via-slate-100/95
          to-slate-200/95

          backdrop-blur-3xl

          shadow-[0_25px_80px_rgba(15,23,42,0.25)]
        "
      >
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-linear-to-r
            from-transparent
            via-cyan-500/70
            to-transparent
          "
        />

        <DialogHeader className="space-y-4 pb-2">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl

                bg-linear-to-br
                from-indigo-500
                via-violet-500
                to-cyan-500

                shadow-lg
              "
            >
              <Sparkles className="h-5 w-5 text-white" />
            </div>

            <div>
              <DialogTitle
                className="
                  text-2xl
                  font-bold

                  bg-linear-to-r
                  from-indigo-500
                  via-violet-500
                  to-cyan-500

                  bg-clip-text
                  text-transparent
                "
              >
                Create New Task
              </DialogTitle>

              <DialogDescription className="text-slate-400">
                Organize work, assign priorities, and keep your
                team moving forward.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div
          className="
            h-px

            bg-linear-to-r
            from-transparent
            via-cyan-500/70
            to-transparent
          "
        />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 pt-4"
        >
          <TaskForm form={form} />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="
                rounded-2xl
                border-white/20
                bg-white/60
                backdrop-blur-xl
                transition-all
                duration-300
                hover:bg-white/80
              "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="
                min-w-[140px]
                rounded-2xl

                bg-linear-to-r
                from-indigo-500
                via-violet-500
                to-cyan-500

                text-white

                shadow-lg

                transition-all
                duration-300

                hover:scale-[1.02]
                hover:shadow-xl
              "
            >
              {isPending
                ? 'Creating...'
                : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}