'use client';

import Link from 'next/link';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

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
      <Card className="cursor-pointer transition-colors hover:bg-muted/50">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-medium">
              {task.title}
            </h3>

            <TaskStatusBadge
              status={task.status}
            />
          </div>

          {task.category && (
            <Badge
              variant="secondary"
              className="w-fit"
            >
              {task.category.name}
            </Badge>
          )}

          {task.description && (
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <span className="font-medium">
                Priority:
              </span>{' '}
              {task.priority}
            </p>

            <p>
              <span className="font-medium">
                Due:
              </span>{' '}
              {task.dueDate
                ? new Date(
                    task.dueDate,
                  ).toLocaleDateString()
                : 'No due date'}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}