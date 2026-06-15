'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { KanbanBoard } from '@/features/tasks/components/kanban-board';

export default function TasksKanbanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Task Board
          </h1>

          <p className="text-muted-foreground">
            Manage tasks using Kanban view
          </p>
        </div>

        <Link href="/tasks">
          <Button variant="outline">
            Table View
          </Button>
        </Link>
      </div>

      <KanbanBoard />
    </div>
  );
}