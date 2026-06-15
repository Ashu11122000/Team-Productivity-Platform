'use client';

import { Input } from '@/components/ui/input';

import type {
  TaskPriority,
  TaskStatus,
} from '../types/task.types';

interface TasksFiltersProps {
  search: string;

  status?: TaskStatus;

  priority?: TaskPriority;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value?: TaskStatus,
  ) => void;

  onPriorityChange: (
    value?: TaskPriority,
  ) => void;
}

export function TasksFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: TasksFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) =>
          onSearchChange(
            e.target.value,
          )
        }
      />

      <select
        value={status ?? ''}
        onChange={(e) =>
          onStatusChange(
            e.target.value
              ? (e.target
                  .value as TaskStatus)
              : undefined,
          )
        }
        className="h-10 rounded-md border bg-background px-3"
      >
        <option value="">
          All Statuses
        </option>

        <option value="TODO">
          To Do
        </option>

        <option value="IN_PROGRESS">
          In Progress
        </option>

        <option value="COMPLETED">
          Completed
        </option>
      </select>

      <select
        value={priority ?? ''}
        onChange={(e) =>
          onPriorityChange(
            e.target.value
              ? (e.target
                  .value as TaskPriority)
              : undefined,
          )
        }
        className="h-10 rounded-md border bg-background px-3"
      >
        <option value="">
          All Priorities
        </option>

        <option value="LOW">
          Low
        </option>

        <option value="MEDIUM">
          Medium
        </option>

        <option value="HIGH">
          High
        </option>
      </select>
    </div>
  );
}