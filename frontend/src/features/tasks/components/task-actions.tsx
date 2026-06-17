'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Task } from '../types/task.types';

import { DeleteTaskDialog } from './delete-task-dialog';
import { UpdateTaskDialog } from './update-task-dialog';

interface Props {
  task: Task;
}

export function TaskActions({
  task,
}: Props) {
  const [updateOpen, setUpdateOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="group h-9 w-9 rounded-2xl border border-transparent bg-transparent text-slate-500 transition-all duration-300 hover:border-white/20 hover:bg-white/70 hover:text-slate-900 hover:shadow-md"
          >
            <MoreHorizontal className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 rounded-2xl border border-white/20 bg-white/85 p-2 backdrop-blur-xl shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
        >
          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200"
          >
            <Link
              href={`/tasks/${task.id}`}
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10">
                <Eye className="h-4 w-4 text-cyan-500" />
              </div>

              <span className="font-medium">
                View Details
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              setUpdateOpen(true)
            }
            className="cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200"
          >
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10">
              <Pencil className="h-4 w-4 text-violet-500" />
            </div>

            <span className="font-medium">
              Edit Task
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-200" />

          <DropdownMenuItem
            onClick={() =>
              setDeleteOpen(true)
            }
            className="cursor-pointer rounded-xl px-3 py-2.5 text-rose-500 transition-all duration-200 focus:text-rose-500"
          >
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10">
              <Trash2 className="h-4 w-4" />
            </div>

            <span className="font-medium">
              Delete Task
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateTaskDialog
        open={updateOpen}
        onOpenChange={
          setUpdateOpen
        }
        task={task}
      />

      <DeleteTaskDialog
        open={deleteOpen}
        onOpenChange={
          setDeleteOpen
        }
        taskId={task.id}
        taskTitle={task.title}
      />
    </>
  );
}