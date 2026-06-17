'use client';

import {
  CalendarDays,
  CheckCircle2,
  FileText,
} from 'lucide-react';

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
    <Card
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border-white/20
        bg-white/70
        p-6
        shadow-lg
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Top Accent Line */}
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

      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-linear-to-br
              from-indigo-500/15
              via-violet-500/15
              to-cyan-500/15
            "
          >
            <FileText
              className="
                h-5
                w-5
                text-indigo-600
              "
            />
          </div>

          <div className="min-w-0">
            <h2
              className="
                truncate
                text-lg
                font-semibold
                text-slate-900
              "
            >
              {note.title}
            </h2>

            <div
              className="
                mt-1
                flex
                items-center
                gap-2
                text-sm
                text-slate-500
              "
            >
              <CalendarDays className="h-4 w-4" />

              {new Date(
                note.created_at,
              ).toLocaleString()}
            </div>
          </div>
        </div>

        <Badge
          className={
            note.is_converted_to_task
              ? `
                rounded-full
                border-emerald-500/20
                bg-emerald-500/10
                text-emerald-700
                hover:bg-emerald-500/10
              `
              : `
                rounded-full
                border-slate-300
                bg-white/70
                text-slate-600
                hover:bg-white/70
              `
          }
        >
          {note.is_converted_to_task ? (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Converted
            </div>
          ) : (
            'Normal'
          )}
        </Badge>
      </div>

      {/* Content */}
      <div
        className="
          whitespace-pre-wrap
          text-sm
          leading-7
          text-slate-600
          line-clamp-6
        "
      >
        {note.content ||
          'No content provided'}
      </div>

      {/* Footer Glow */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-12
          right-0
          h-24
          w-24
          rounded-full
          bg-cyan-400/10
          blur-3xl
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />
    </Card>
  );
}