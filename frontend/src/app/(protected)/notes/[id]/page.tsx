'use client';

import Link from 'next/link';

import { notFound } from 'next/navigation';

import {
  ArrowLeft,
  FileText,
} from 'lucide-react';

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
      <div className="space-y-8">
        <div
          className="
            rounded-3xl
            border
            border-white/20
            bg-white/70
            p-8
            shadow-lg
            backdrop-blur-xl
          "
        >
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-4 h-4 w-96" />
        </div>

        <Skeleton
          className="
            h-[420px]
            w-full
            rounded-3xl
          "
        />
      </div>
    );
  }

  if (
    isError ||
    !note
  ) {
    return (
      <div
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
        "
      >
        <div
          className="
            rounded-3xl
            border
            border-white/20
            bg-white/70
            p-10
            text-center
            shadow-lg
            backdrop-blur-xl
          "
        >
          <FileText
            className="
              mx-auto
              mb-4
              h-12
              w-12
              text-slate-400
            "
          />

          <h2
            className="
              text-xl
              font-semibold
              text-slate-900
            "
          >
            Note Not Found
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            The note you are looking
            for does not exist or has
            been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/20
          bg-white/70
          p-8
          shadow-lg
          backdrop-blur-xl
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

        <div className="space-y-4">
          <div
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/10
              px-4
              py-1.5
              text-xs
              font-medium
              text-cyan-700
            "
          >
            Notes Workspace
          </div>

          <h1
            className="
              text-4xl
              font-bold

              bg-linear-to-r
              from-indigo-600
              via-violet-600
              to-cyan-600

              bg-clip-text
              text-transparent
            "
          >
            {note.title}
          </h1>

          <p
            className="
              max-w-2xl
              text-sm
              text-slate-500
            "
          >
            View, update, organize,
            and convert notes into
            actionable tasks across
            your workspace.
          </p>
        </div>
      </section>

      {/* Action Toolbar */}
      <section
        className="
          rounded-3xl
          border
          border-white/20
          bg-white/70
          p-4
          shadow-lg
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          <Button
            asChild
            variant="outline"
            className="
              rounded-2xl
              bg-white/80
              backdrop-blur-xl
            "
          >
            <Link href="/notes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Notes
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
      </section>

      {/* Note Content */}
      <section>
        <NoteCard note={note} />
      </section>
    </div>
  );
}