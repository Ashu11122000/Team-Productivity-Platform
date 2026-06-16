'use client';

import { Task } from '../types/task.types';

import { TaskCard } from './task-card';

interface KanbanColumnProps {
  title: string;

  tasks: Task[];
}

export function KanbanColumn({
  title,
  tasks,
}: KanbanColumnProps) {
  return (
    <div className="flex-1 rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">
          {title}
        </h2>

        <span className="text-sm text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}