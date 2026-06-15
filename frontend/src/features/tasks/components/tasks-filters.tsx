'use client';

import { Input } from '@/components/ui/input';

interface TasksFiltersProps {
  search: string;

  onSearchChange: (
    value: string,
  ) => void;
}

export function TasksFilters({
  search,
  onSearchChange,
}: TasksFiltersProps) {
  return (
    <Input
      placeholder="Search tasks..."
      value={search}
      onChange={(e) =>
        onSearchChange(e.target.value)
      }
    />
  );
}