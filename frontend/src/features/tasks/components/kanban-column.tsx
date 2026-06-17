'use client';

import { FolderKanban } from 'lucide-react';

import { Task } from '../types/task.types';

import { TaskCard } from './task-card';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
}

function getColumnStyles(title: string) {
  const status = title.toUpperCase();

  switch (status) {
    case 'TODO':
      return {
        badge:
          'bg-slate-100 text-slate-900 border-slate-200',
        glow: 'bg-slate-400/10',
        count:
          'bg-slate-100 text-slate-900 border-slate-200',
      };

    case 'IN_PROGRESS':
      return {
        badge:
          'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
        glow: 'bg-cyan-400/20',
        count:
          'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
      };

    case 'DONE':
    case 'COMPLETED':
      return {
        badge:
          'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        glow: 'bg-emerald-400/20',
        count:
          'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      };

    case 'BLOCKED':
      return {
        badge:
          'bg-rose-500/10 text-rose-600 border-rose-500/20',
        glow: 'bg-rose-400/20',
        count:
          'bg-rose-500/10 text-rose-600 border-rose-500/20',
      };

    default:
      return {
        badge:
          'bg-slate-100 text-slate-900 border-slate-200',
        glow: 'bg-slate-400/10',
        count:
          'bg-slate-100 text-slate-900 border-slate-200',
      };
  }
}

export function KanbanColumn({
  title,
  tasks,
}: KanbanColumnProps) {
  const styles = getColumnStyles(title);

  return (
    <div className="group relative flex min-h-[600px] flex-1 flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Ambient Glow */}
      <div
        className={`absolute inset-0 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${styles.glow}`}
      />

      {/* Header */}
      <div className="relative border-b border-white/20 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${styles.badge}`}
            >
              <FolderKanban className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                {title.replace('_', ' ')}
              </h2>

              <p className="text-xs text-slate-500">
                Task Pipeline
              </p>
            </div>
          </div>

          <div
            className={`rounded-2xl border px-3 py-1 text-sm font-semibold ${styles.count}`}
          >
            {tasks.length}
          </div>
        </div>

        {/* Accent Divider */}
        <div className="mt-4 h-px bg-linear-to-r from-transparent via-cyan-500/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex-1 space-y-4 p-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
              <FolderKanban className="h-6 w-6 text-slate-400" />
            </div>

            <p className="text-sm font-medium text-slate-700">
              No tasks available
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Tasks in this stage will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}