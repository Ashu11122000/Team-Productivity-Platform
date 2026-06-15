'use client';

import { useUpdateTaskStatus } from '../hooks/use-update-task-status';

import type {
  Task,
  TaskStatus,
} from '../types/task.types';

interface Props {
  task: Task;
}

export function TaskStatusSelect({
  task,
}: Props) {
  const {
    mutate,
    isPending,
  } =
    useUpdateTaskStatus();

  return (
    <select
      value={task.status}
      disabled={isPending}
      onChange={(e) =>
        mutate({
          id: task.id,
          status:
            e.target.value as TaskStatus,
        })
      }
      className="rounded-md border p-2"
    >
      <option value="TODO">
        To Do
      </option>

      <option value="IN_PROGRESS">
        In Progress
      </option>

      <option value="COMPLETED">
        Completed
      </option>
    </select>
  );
}