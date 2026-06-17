'use client';

import {
  Flag,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-5 backdrop-blur-xl shadow-lg">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-linear-to-r from-cyan-400/5 via-violet-400/5 to-indigo-400/5" />

      <div className="relative">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-cyan-500 text-white shadow-lg">
            <SlidersHorizontal className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Filters
            </h3>

            <p className="text-xs text-slate-500">
              Refine and search tasks
            </p>
          </div>
        </div>

        {/* Accent Divider */}
        <div className="mb-5 h-px bg-linear-to-r from-transparent via-cyan-500/70 to-transparent" />

        {/* Filters */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Search
            </label>

            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) =>
                  onSearchChange(
                    e.target.value,
                  )
                }
                className="h-12 rounded-2xl border-white/20 bg-white/80 pl-10 backdrop-blur-xl"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Status
            </label>

            <Select
              value={
                status ??
                '__all__'
              }
              onValueChange={(
                value,
              ) =>
                onStatusChange(
                  value ===
                    '__all__'
                    ? undefined
                    : (value as TaskStatus),
                )
              }
            >
              <SelectTrigger className="h-12 rounded-2xl border-white/20 bg-white/80 backdrop-blur-xl">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>

              <SelectContent className="rounded-2xl border-white/20 bg-white/90 backdrop-blur-xl">
                <SelectItem value="__all__">
                  All Statuses
                </SelectItem>

                <SelectItem value="TODO">
                  To Do
                </SelectItem>

                <SelectItem value="IN_PROGRESS">
                  In Progress
                </SelectItem>

                <SelectItem value="COMPLETED">
                  Completed
                </SelectItem>

                <SelectItem value="BLOCKED">
                  Blocked
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <Flag className="h-3.5 w-3.5" />
              Priority
            </label>

            <Select
              value={
                priority ??
                '__all__'
              }
              onValueChange={(
                value,
              ) =>
                onPriorityChange(
                  value ===
                    '__all__'
                    ? undefined
                    : (value as TaskPriority),
                )
              }
            >
              <SelectTrigger className="h-12 rounded-2xl border-white/20 bg-white/80 backdrop-blur-xl">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>

              <SelectContent className="rounded-2xl border-white/20 bg-white/90 backdrop-blur-xl">
                <SelectItem value="__all__">
                  All Priorities
                </SelectItem>

                <SelectItem value="LOW">
                  Low
                </SelectItem>

                <SelectItem value="MEDIUM">
                  Medium
                </SelectItem>

                <SelectItem value="HIGH">
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}