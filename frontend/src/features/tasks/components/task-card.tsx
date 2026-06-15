'use client';

import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

import { Task } from '../types/task.types';

import { TaskStatusBadge } from './task-status-badge';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({
  task,
}: TaskCardProps) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {task.title}
            </h3>

            <TaskStatusBadge
              status={task.status}
            />
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="text-xs text-muted-foreground">
            Priority: {task.priority}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}