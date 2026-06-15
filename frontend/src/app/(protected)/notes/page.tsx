'use client';

import { useState } from 'react';

import { CreateNoteDialog } from '@/features/notes/components/create-note-dialog';
import { NoteFilters } from '@/features/notes/components/note-filters';
import { NoteTable } from '@/features/notes/components/note-table';

import { useNotes } from '@/features/notes/hooks/use-notes';

import { Skeleton } from '@/components/ui/skeleton';

export default function NotesPage() {
  const [search, setSearch] = useState('');

  const { data: notes, isLoading, isError } = useNotes();

  const filteredNotes =
    notes?.filter((note) =>
      note.title.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div>Failed to load notes.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>

          <p className="text-muted-foreground">Manage your notes</p>
        </div>

        <CreateNoteDialog />
      </div>

      <NoteFilters search={search} onSearchChange={setSearch} />

      <NoteTable notes={filteredNotes} />
    </div>
  );
}
