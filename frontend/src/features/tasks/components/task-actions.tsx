'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  MoreHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Task } from '../types/task.types';

import { UpdateTaskDialog } from './update-task-dialog';

import { useDeleteTask } from '../hooks/use-delete-task';

interface Props {
  task: Task;
}

export function TaskActions({
  task,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const { mutate } =
    useDeleteTask();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
        >
          <Button
            variant="ghost"
            size="icon"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
        >
          <DropdownMenuItem
            asChild
          >
            <Link
              href={`/tasks/${task.id}`}
            >
              View
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              setOpen(true)
            }
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              const confirmed =
                window.confirm(
                  'Delete this task?',
                );

              if (
                confirmed
              ) {
                mutate(
                  task.id,
                );
              }
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateTaskDialog
        open={open}
        onOpenChange={
          setOpen
        }
        task={task}
      />
    </>
  );
}