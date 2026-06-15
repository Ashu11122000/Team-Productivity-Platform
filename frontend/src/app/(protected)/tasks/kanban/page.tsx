'use client';

import { KanbanBoard } from '@/features/tasks/components/kanban-board';

export default function TasksKanbanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Task Board
        </h1>

        <p className="text-muted-foreground">
          Manage tasks using Kanban view
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
}