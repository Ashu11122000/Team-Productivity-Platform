'use client';

import { useState } from 'react';

import {
  CheckCircle2,
  FileText,
  PlusCircle,
  Search,
} from 'lucide-react';

import { CreateNoteDialog } from '@/features/notes/components/create-note-dialog';
import { NoteFilters } from '@/features/notes/components/note-filters';
import { NoteTable } from '@/features/notes/components/note-table';

import { useNotes } from '@/features/notes/hooks/use-notes';

import { Skeleton } from '@/components/ui/skeleton';

export default function NotesPage() {
  const [search, setSearch] =
    useState('');

  const {
    data: notes,
    isLoading,
    isError,
  } = useNotes();

  const filteredNotes =
    notes?.filter((note) =>
      note.title
        .toLowerCase()
        .includes(
          search.toLowerCase(),
        ),
    ) ?? [];

  const totalNotes =
    notes?.length ?? 0;

  const convertedNotes =
    notes?.filter(
      (note) =>
        note.is_converted_to_task,
    ).length ?? 0;

  const activeNotes =
    totalNotes -
    convertedNotes;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full rounded-3xl" />

        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>

        <Skeleton className="h-20 rounded-3xl" />

        <Skeleton className="h-[500px] rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-rose-200
          bg-rose-50
          p-8
          text-center
        "
      >
        <h2 className="text-xl font-semibold text-rose-600">
          Failed to load notes
        </h2>

        <p className="mt-2 text-sm text-rose-500">
          Please try again later.
        </p>
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
            Notes
          </h1>

          <p
            className="
              max-w-2xl
              text-sm
              text-slate-500
            "
          >
            Organize ideas, meeting
            notes, documentation,
            research, and important
            information across your
            workspace.
          </p>
        </div>
      </section>

      {/* KPI Cards */}

      <section className="grid gap-6 md:grid-cols-3">
        <div
          className="
            rounded-3xl
            border
            border-white/20
            bg-white/70
            p-6
            shadow-lg
            backdrop-blur-xl
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Notes
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {totalNotes}
              </h3>
            </div>

            <div
              className="
                rounded-2xl
                bg-indigo-500/10
                p-3
              "
            >
              <FileText className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
        </div>

        <div
          className="
            rounded-3xl
            border
            border-white/20
            bg-white/70
            p-6
            shadow-lg
            backdrop-blur-xl
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Active Notes
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {activeNotes}
              </h3>
            </div>

            <div
              className="
                rounded-2xl
                bg-cyan-500/10
                p-3
              "
            >
              <Search className="h-6 w-6 text-cyan-500" />
            </div>
          </div>
        </div>

        <div
          className="
            rounded-3xl
            border
            border-white/20
            bg-white/70
            p-6
            shadow-lg
            backdrop-blur-xl
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Converted
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {convertedNotes}
              </h3>
            </div>

            <div
              className="
                rounded-2xl
                bg-emerald-500/10
                p-3
              "
            >
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}

      <section
        className="
          rounded-3xl
          border
          border-white/20
          bg-white/70
          p-5
          shadow-lg
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div className="flex-1">
            <NoteFilters
              search={search}
              onSearchChange={
                setSearch
              }
            />
          </div>

          <div className="shrink-0">
            <CreateNoteDialog />
          </div>
        </div>
      </section>

      {/* Notes Table */}

      <section>
        <NoteTable
          notes={filteredNotes}
        />
      </section>
    </div>
  );
}