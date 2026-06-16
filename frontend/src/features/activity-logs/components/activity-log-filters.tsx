"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ActivityLogFiltersProps {
  search: string;
  action: string;
  onSearchChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onReset: () => void;
}

export function ActivityLogFilters({
  search,
  action,
  onSearchChange,
  onActionChange,
  onReset,
}: ActivityLogFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <Input
        placeholder="Search activity..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="md:max-w-sm"
      />

      <Select
        value={action}
        onValueChange={onActionChange}
      >
        <SelectTrigger className="w-full md:w-[220px]">
          <SelectValue placeholder="Filter by action" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Actions
          </SelectItem>

          <SelectItem value="NOTE_CREATED">
            Note Created
          </SelectItem>

          <SelectItem value="NOTE_UPDATED">
            Note Updated
          </SelectItem>

          <SelectItem value="NOTE_DELETED">
            Note Deleted
          </SelectItem>

          <SelectItem value="TASK_CREATED">
            Task Created
          </SelectItem>

          <SelectItem value="TASK_UPDATED">
            Task Updated
          </SelectItem>

          <SelectItem value="TASK_COMPLETED">
            Task Completed
          </SelectItem>

          <SelectItem value="TASK_DELETED">
            Task Deleted
          </SelectItem>

          <SelectItem value="CATEGORY_CREATED">
            Category Created
          </SelectItem>

          <SelectItem value="CATEGORY_UPDATED">
            Category Updated
          </SelectItem>

          <SelectItem value="CATEGORY_DELETED">
            Category Deleted
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={onReset}
      >
        Reset
      </Button>
    </div>
  );
}