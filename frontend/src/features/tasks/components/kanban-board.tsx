'use client';

import { useTaskKanban } from '../hooks/use-task-kanban';

import { KanbanColumn } from './kanban-column';

export function KanbanBoard() {
  const {
    columns,
    isLoading,
  } = useTaskKanban();

  if (isLoading) {
    return (
      <div>
        Loading board...
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <KanbanColumn
        title="To Do"
        tasks={columns.TODO}
      />

      <KanbanColumn
        title="In Progress"
        tasks={columns.IN_PROGRESS}
      />

      <KanbanColumn
        title="Completed"
        tasks={columns.COMPLETED}
      />
    </div>
  );
}