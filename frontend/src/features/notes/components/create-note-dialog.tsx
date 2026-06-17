'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  Loader2,
  Plus,
} from 'lucide-react';

import { useForm } from 'react-hook-form';

import { toast } from 'sonner';

import {
  createNoteSchema,
  type CreateNoteSchema,
} from '../schemas/create-note.schema';

import { useCreateNote } from '../hooks/use-create-note';

import { NoteForm } from './note-form';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CreateNoteDialogProps {
  defaultOpen?: boolean;
}

export function CreateNoteDialog({
  defaultOpen = false,
}: CreateNoteDialogProps) {
  const [open, setOpen] =
    useState(defaultOpen);

  const mutation = useCreateNote();

  const form =
    useForm<CreateNoteSchema>({
      resolver: zodResolver(
        createNoteSchema,
      ),

      defaultValues: {
        title: '',
        content: '',
      },
    });

  const onSubmit = async (
    values: CreateNoteSchema,
  ) => {
    try {
      await mutation.mutateAsync({
        title: values.title,
        content: values.content,
      });

      form.reset({
        title: '',
        content: '',
      });

      setOpen(false);

      toast.success(
        'Note created successfully',
      );
    } catch {
      toast.error(
        'Failed to create note',
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      {!defaultOpen && (
        <DialogTrigger asChild>
          <Button
            className="
              rounded-2xl
              border-0
              bg-linear-to-r
              from-indigo-500
              via-violet-500
              to-cyan-500
              text-white
              shadow-lg
              shadow-indigo-500/25
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              hover:shadow-violet-500/30
            "
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Note
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className="
          max-w-2xl
          rounded-3xl
          border-white/20
          bg-linear-to-br
          from-slate-100/95
          via-white/90
          to-slate-100/95
          shadow-[0_25px_80px_rgba(15,23,42,0.25)]
          backdrop-blur-3xl
        "
      >
        <DialogHeader className="space-y-3">
          <DialogTitle
            className="
              bg-linear-to-r
              from-indigo-600
              via-violet-600
              to-cyan-600
              bg-clip-text
              text-2xl
              font-bold
              text-transparent
            "
          >
            Create New Note
          </DialogTitle>

          <p className="text-sm text-slate-500">
            Capture ideas, meeting notes,
            research, and important
            information in your workspace.
          </p>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(
            onSubmit,
          )}
          className="mt-6 space-y-6"
        >
          <NoteForm form={form} />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                mutation.isPending
              }
              className="
                min-w-40
                rounded-2xl
                border-0
                bg-linear-to-r
                from-indigo-500
                via-violet-500
                to-cyan-500
                text-white
                shadow-lg
                shadow-indigo-500/25
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
              "
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Note
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}