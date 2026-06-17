'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Edit3,
  Loader2,
  Save,
} from 'lucide-react';
import {
  useForm,
  UseFormReturn,
} from 'react-hook-form';

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

export function UpdateNoteDialog({
  note,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const mutation =
    useUpdateNote();

  const form =
    useForm<UpdateNoteSchema>({
      resolver: zodResolver(
        updateNoteSchema,
      ),

      defaultValues: {
        title: note.title,
        content:
          note.content ?? '',
      },
    });

  useEffect(() => {
    form.reset({
      title: note.title,
      content:
        note.content ?? '',
    });
  }, [note, form]);

  async function onSubmit(
    values: UpdateNoteSchema,
  ) {
    try {
      await mutation.mutateAsync({
        id: note.id,
        data: values,
      });

      toast.success(
        'Note updated successfully',
      );

      setOpen(false);
    } catch {
      toast.error(
        'Failed to update note',
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="
            rounded-2xl
            border-slate-300
            bg-white/80
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-cyan-500/30
            hover:bg-white
            hover:shadow-lg
          "
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

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
        {/* Accent Line */}
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

        <DialogHeader className="space-y-3">
          <DialogTitle
            className="
              flex
              items-center
              gap-3

              text-2xl
              font-bold

              bg-linear-to-r
              from-indigo-600
              via-violet-600
              to-cyan-600

              bg-clip-text
              text-transparent
            "
          >
            <Edit3
              className="
                h-6
                w-6
                text-indigo-500
              "
            />
            Update Note
          </DialogTitle>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Refine your ideas, update
            information, and keep your
            notes organized.
          </p>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(
            onSubmit,
          )}
          className="
            mt-6
            space-y-6
          "
        >
          <NoteForm
            form={
              form as UseFormReturn<{
                title: string;
                content: string;
              }>
            }
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                mutation.isPending
              }
              className="
                min-w-44

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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}