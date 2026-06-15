'use client';

import Link from 'next/link';

import { Note } from '../types/note.types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import { DeleteNoteDialog } from './delete-note-dialog';
import { UpdateNoteDialog } from './update-note-diaolog';

interface Props {
  notes: Note[];
}

export function NoteTable({
  notes,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            Title
          </TableHead>

          <TableHead>
            Created
          </TableHead>

          <TableHead>
            Status
          </TableHead>

          <TableHead>
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {notes.map((note) => (
          <TableRow
            key={note.id}
          >
            <TableCell>
              {note.title}
            </TableCell>

            <TableCell>
              {new Date(
                note.created_at,
              ).toLocaleDateString()}
            </TableCell>

            <TableCell>
              <Badge
                variant={
                  note.is_converted_to_task
                    ? 'secondary'
                    : 'outline'
                }
              >
                {note.is_converted_to_task
                  ? 'Converted'
                  : 'Normal'}
              </Badge>
            </TableCell>

            <TableCell>
              <div className="flex gap-2">
                <Button
                  asChild
                  size="sm"
                >
                  <Link
                    href={`/notes/${note.id}`}
                  >
                    View
                  </Link>
                </Button>

                <UpdateNoteDialog
                  note={note}
                />

                <DeleteNoteDialog
                  noteId={note.id}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}