'use client';

import { useEffect } from 'react';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';

import { toast } from 'sonner';

import { Note } from '../types/note.types';

import {
  updateNoteSchema,
  UpdateNoteSchema,
} from '../schemas/update-note.schema';

import { useUpdateNote } from '../hooks/use-update-note';

import { NoteForm } from './note-form';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  note: Note;
}

export function UpdateNoteDialog({ note }: Props) {
  const [open, setOpen] = useState(false);

  const mutation = useUpdateNote();

  const form = useForm<UpdateNoteSchema>({
    resolver: zodResolver(updateNoteSchema),

    defaultValues: {
      title: note.title,
      content: note.content ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      title: note.title,
      content: note.content ?? '',
    });
  }, [note, form]);

  async function onSubmit(values: UpdateNoteSchema) {
    try {
      await mutation.mutateAsync({
        id: note.id,
        data: values,
      });

      toast.success('Note updated');

      setOpen(false);
    } catch {
      toast.error('Failed to update note');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Note</DialogTitle>
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

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
