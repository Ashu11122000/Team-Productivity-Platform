'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

interface NoteFiltersProps {
  search: string;
  onSearchChange: (
    value: string,
  ) => void;
}

export function NoteFilters({
  search,
  onSearchChange,
}: NoteFiltersProps) {
  return (
    <div
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
      <div className="relative">
        <Search
          className="
            absolute
            left-4
            top-1/2
            h-5
            w-5
            -translate-y-1/2
            text-slate-400
          "
        />

        <Input
          value={search}
          placeholder="Search notes, ideas, meetings, research..."
          onChange={(e) =>
            onSearchChange(
              e.target.value,
            )
          }
          className="
            h-12
            rounded-2xl
            border-slate-200
            bg-white/80
            pl-12
            text-sm
            shadow-sm
            transition-all
            duration-300

            placeholder:text-slate-400

            focus:border-cyan-500
            focus:ring-2
            focus:ring-cyan-500/20

            hover:border-slate-300
          "
          aria-label="Search notes"
        />
      </div>
    </div>
  );
}