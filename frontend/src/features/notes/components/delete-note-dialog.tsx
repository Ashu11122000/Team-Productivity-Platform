
'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { useDeleteNote } from '../hooks/use-delete-note';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  noteId: number;
}

export function DeleteNoteDialog({
  noteId,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const mutation =
    useDeleteNote();

  async function handleDelete() {
    try {
      await mutation.mutateAsync(
        noteId,
      );

      toast.success(
        'Note deleted',
      );

      setOpen(false);
    } catch {
      toast.error(
        'Failed to delete note',
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
          variant="destructive"
        >
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Note
          </DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to
          delete this note?
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={
              handleDelete
            }
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}