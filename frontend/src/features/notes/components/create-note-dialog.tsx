'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';

import { toast } from 'sonner';

import {
  createNoteSchema,
  CreateNoteSchema,
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

export function CreateNoteDialog() {
  const [open, setOpen] = useState(false);

  const mutation = useCreateNote();

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),

    defaultValues: {
      title: '',
      content: '',
    },
  });

  async function onSubmit(values: CreateNoteSchema) {
    try {
      await mutation.mutateAsync(values);

      toast.success('Note created successfully');

      form.reset();

      setOpen(false);
    } catch {
      toast.error('Failed to create note');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Note</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <NoteForm
            form={
              form as UseFormReturn<{
                title: string;
                content: string;
              }>
            }
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Creating...' : 'Create Note'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
