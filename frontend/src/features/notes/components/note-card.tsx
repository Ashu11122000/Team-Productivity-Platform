'use client';

import { Note } from '../types/note.types';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({
  note,
}: NoteCardProps) {
  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {note.title}
        </h2>

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
      </div>

      <div className="text-sm text-muted-foreground">
        Created:{' '}
        {new Date(
          note.created_at,
        ).toLocaleString()}
      </div>

      <div className="whitespace-pre-wrap">
        {note.content ||
          'No content provided'}
      </div>
    </Card>
  );
}