'use client';

import Link from 'next/link';

import {
  LayoutGrid,
  Sparkles,
  Table2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { KanbanBoard } from '@/features/tasks/components/kanban-board';

export default function TasksKanbanPage() {
  return (
    <div className="relative space-y-8">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-[160px]" />

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-400/10 blur-[160px]" />

        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-400/10 blur-[160px]" />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-slate-200/90 via-slate-100/85 to-slate-200/90 p-8 backdrop-blur-3xl shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
              <Sparkles className="h-4 w-4" />
              Kanban Workspace
            </div>

            <div>
              <h1 className="bg-linear-to-r from-slate-900 via-indigo-700 to-cyan-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                Task Board
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Organize, prioritize and track work
                across your workflow using an
                enterprise-grade Kanban experience.
              </p>
            </div>
          </div>

          <Link href="/tasks">
            <Button
              variant="outline"
              className="rounded-2xl border-white/20 bg-white/70 backdrop-blur-xl"
            >
              <Table2 className="mr-2 h-4 w-4" />
              Table View
            </Button>
          </Link>
        </div>

        <div className="mt-6 h-px bg-linear-to-r from-transparent via-cyan-500/70 to-transparent" />

        {/* Quick Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/20 bg-white/60 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                <LayoutGrid className="h-5 w-5 text-cyan-600" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  View Mode
                </p>

                <p className="font-semibold text-slate-900">
                  Kanban Board
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/60 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Workflow
            </p>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              Visual Task Tracking
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/60 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Experience
            </p>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              Linear Inspired
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="relative">
        <KanbanBoard />
      </div>
    </div>
  );
}