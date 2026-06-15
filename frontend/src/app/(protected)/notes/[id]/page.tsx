'use client';

import Link from 'next/link';

import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { NoteCard } from '@/features/notes/components/note-card';
import { UpdateNoteDialog } from '@/features/notes/components/update-note-diaolog';
import { DeleteNoteDialog } from '@/features/notes/components/delete-note-dialog';
import { ConvertTaskButton } from '@/features/notes/components/convert-task-button';

import { useNote } from '@/features/notes/hooks/use-note';

interface NoteDetailsPageProps {
  params: {
    id: string;
  };
}

export default function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const noteId = Number(
    params.id,
  );

  const {
    data: note,
    isLoading,
    isError,
  } = useNote(noteId);

  if (
    Number.isNaN(noteId)
  ) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (
    isError ||
    !note
  ) {
    return (
      <div>
        Note not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          asChild
          variant="outline"
        >
          <Link href="/notes">
            Back
          </Link>
        </Button>

        <UpdateNoteDialog
          note={note}
        />

        <DeleteNoteDialog
          noteId={note.id}
        />

        <ConvertTaskButton
          noteId={note.id}
          isConverted={
            note.is_converted_to_task
          }
        />
      </div>

      <NoteCard note={note} />
    </div>
  );
}