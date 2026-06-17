'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  Loader2,
  Trash2,
} from 'lucide-react';

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
        'Note deleted successfully',
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
          className="
            rounded-2xl
            bg-rose-500
            text-white
            shadow-lg
            shadow-rose-500/20
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-rose-600
            hover:shadow-xl
          "
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          max-w-md
          overflow-hidden
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
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-linear-to-r
            from-transparent
            via-rose-500/80
            to-transparent
          "
        />

        <DialogHeader className="items-center text-center">
          <div
            className="
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-rose-500/10
              ring-8
              ring-rose-500/5
            "
          >
            <AlertTriangle
              className="
                h-8
                w-8
                text-rose-500
              "
            />
          </div>

          <DialogTitle
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Delete Note
          </DialogTitle>

          <p
            className="
              max-w-sm
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            This action cannot be
            undone. The note and all
            associated information
            will be permanently
            removed from your
            workspace.
          </p>
        </DialogHeader>

        <DialogFooter
          className="
            mt-6
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <Button
            variant="outline"
            onClick={() =>
              setOpen(false)
            }
            disabled={
              mutation.isPending
            }
            className="
              rounded-2xl
              border-slate-300
              bg-white/80
              backdrop-blur-xl
              transition-all
              hover:bg-slate-100
            "
          >
            Cancel
          </Button>

          <Button
            onClick={
              handleDelete
            }
            disabled={
              mutation.isPending
            }
            className="
              rounded-2xl
              bg-rose-500
              text-white
              shadow-lg
              shadow-rose-500/20
              transition-all
              duration-300
              hover:bg-rose-600
              hover:shadow-xl
            "
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Note
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}