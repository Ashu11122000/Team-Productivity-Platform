'use client';

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
    <div className="flex items-center gap-4">
      <Input
        value={search}
        placeholder="Search notes..."
        onChange={(e) =>
          onSearchChange(
            e.target.value,
          )
        }
      />
    </div>
  );
}