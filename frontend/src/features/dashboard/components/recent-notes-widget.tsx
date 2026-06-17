'use client';

import Link from 'next/link';

import { format } from 'date-fns';

import {
  FileText,
  Plus,
  ChevronRight,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Button,
} from '@/components/ui/button';

import {
  Badge,
} from '@/components/ui/badge';

import { Note } from '@/features/notes/types/note.types';

interface Props {
  notes: Note[];
}

export function RecentNotesWidget({
  notes,
}: Props) {
  const recentNotes =
    notes.slice(0, 5);

  return (
    <Card
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />

              Recent Notes

              <Badge
                variant="secondary"
                className="
                  rounded-full
                  bg-indigo-100
                  text-indigo-700
                "
              >
                {notes.length}
              </Badge>
            </CardTitle>

            <CardDescription>
              Your latest notes and ideas
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              asChild
            >
              <Link href="/notes?create=true">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Link>
            </Button>

            <Button
              size="sm"
              variant="outline"
              asChild
            >
              <Link href="/notes">
                View All

                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {recentNotes.length ===
        0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <FileText className="mb-4 h-10 w-10 text-slate-300" />

            <p className="font-medium text-slate-700">
              No Notes Yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first note to start organizing ideas.
            </p>

            <Button
              asChild
              className="mt-5 bg-indigo-600 hover:bg-indigo-700"
            >
              <Link href="/notes?create=true">
                <Plus className="mr-2 h-4 w-4" />
                Create Note
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentNotes.map(
              (note) => (
                <div
                  key={note.id}
                  className="
                    rounded-2xl
                    border
                    border-slate-100
                    p-4
                    transition-colors
                    hover:bg-slate-50
                  "
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">
                        {note.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Created{' '}
                        {format(
                          new Date(
                            note.created_at,
                          ),
                          'dd MMM yyyy',
                        )}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                    >
                      <Link
                        href={`/notes/${note.id}`}
                      >
                        Open
                      </Link>
                    </Button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}