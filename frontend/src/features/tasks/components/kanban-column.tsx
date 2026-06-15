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
      <h2 className="mb-4 font-semibold">
        {title}
      </h2>

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