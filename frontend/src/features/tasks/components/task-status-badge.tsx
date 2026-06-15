'use client';

import { Badge } from '@/components/ui/badge';

import { TaskStatus } from '../types/task.types';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

export function TaskStatusBadge({
  status,
}: TaskStatusBadgeProps) {
  switch (status) {
    case 'TODO':
      return (
        <Badge variant="secondary">
          To Do
        </Badge>
      );

    case 'IN_PROGRESS':
      return (
        <Badge>
          In Progress
        </Badge>
      );

    case 'COMPLETED':
      return (
        <Badge variant="outline">
          Completed
        </Badge>
      );

    default:
      return null;
  }
}