'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';

import { Button } from '../../../components/ui/button';

import { useDeleteTask } from '../hooks/use-delete-task';

interface DeleteTaskDialogProps {
  taskId: string;
}

export function DeleteTaskDialog({
  taskId,
}: DeleteTaskDialogProps) {
  const { mutate, isPending } =
    useDeleteTask();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
      >
        <Button
          variant="destructive"
        >
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Task?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={() =>
              mutate(taskId)
            }
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}