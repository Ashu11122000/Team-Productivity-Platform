'use client';

import Link from 'next/link';

import {
  notFound,
  useParams,
} from 'next/navigation';

import {
  ArrowLeft,
  FileText,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import {
  Skeleton,
} from '@/components/ui/skeleton';

import {
  NoteCard,
} from '@/features/notes/components/note-card';

import {
  UpdateNoteDialog,
} from '@/features/notes/components/update-note-diaolog';

import {
  DeleteNoteDialog,
} from '@/features/notes/components/delete-note-dialog';

import {
  ConvertTaskButton,
} from '@/features/notes/components/convert-task-button';

import {
  useNote,
} from '@/features/notes/hooks/use-note';

export default function NoteDetailsPage() {
  const params =
    useParams();

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
            border-slate-200
            bg-white
            p-8
            shadow-sm
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
            border-slate-200
            bg-white
            p-10
            text-center
            shadow-sm
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

          <Button
            asChild
            className="mt-6"
          >
            <Link href="/notes">
              Back to Notes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <div className="space-y-4">
          <div
            className="
              inline-flex
              items-center
              rounded-full
              bg-indigo-100
              px-4
              py-1.5
              text-xs
              font-medium
              text-indigo-700
            "
          >
            Notes Workspace
          </div>

          <h1
            className="
              text-4xl
              font-bold
              text-slate-900
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

      {/* Actions */}
      <section
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
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

      {/* Content */}
      <section>
        <NoteCard note={note} />
      </section>
    </div>
  );
}