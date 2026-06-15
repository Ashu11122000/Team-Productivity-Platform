'use client';

import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Task } from '../types/task.types';

import { TaskActions } from './task-actions';

import { TaskStatusBadge } from './task-status-badge';

interface TasksTableProps {
  tasks: Task[];
}

export function TasksTable({ tasks }: TasksTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>

          <TableHead>Status</TableHead>

          <TableHead>Priority</TableHead>

          <TableHead>Due Date</TableHead>

          <TableHead>Actions</TableHead>

        </TableRow>
      </TableHeader>

      <TableBody>
        {tasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No tasks found
            </TableCell>
          </TableRow>
        ) : (
          tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Link href={`/tasks/${task.id}`} className="hover:underline">
                  {task.title}
                </Link>
              </TableCell>

              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>

              <TableCell>{task.priority}</TableCell>

              <TableCell>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : '-'}
              </TableCell>

              <TableCell>
  <TaskActions
    task={task}
  />
</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
