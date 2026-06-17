'use client';

import {
  Trash2,
  AlertTriangle,
} from 'lucide-react';

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
  taskTitle: string;
  open?: boolean;
  onOpenChange?: (
    open: boolean,
  ) => void;
}

export function DeleteTaskDialog({
  taskId,
  taskTitle,
  open,
  onOpenChange,
}: DeleteTaskDialogProps) {
  const { mutate, isPending } =
    useDeleteTask();

  const handleDelete = () => {
    mutate(taskId, {
      onSuccess: () => {
        onOpenChange?.(false);
      },
    });
  };

  const isControlled =
    open !== undefined &&
    onOpenChange !== undefined;

  return (
    <AlertDialog
      open={
        isControlled
          ? open
          : undefined
      }
      onOpenChange={
        isControlled
          ? onOpenChange
          : undefined
      }
    >
      {!isControlled && (
        <AlertDialogTrigger asChild>
          <Button
            className="
              rounded-2xl
              bg-rose-500
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:bg-rose-500/90
              hover:shadow-xl
            "
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent
        className="
          max-w-md
          overflow-hidden
          rounded-3xl
          border-white/20
          bg-linear-to-br
          from-slate-200/95
          via-slate-100/95
          to-slate-200/95
          backdrop-blur-3xl
          shadow-[0_25px_80px_rgba(15,23,42,0.25)]
        "
      >
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-linear-to-r
            from-transparent
            via-rose-500/70
            to-transparent
          "
        />

        <AlertDialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-rose-500/20
                bg-rose-500/10
              "
            >
              <AlertTriangle
                className="
                  h-6
                  w-6
                  text-rose-500
                "
              />
            </div>

            <div className="space-y-2">
              <AlertDialogTitle
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                Delete Task?
              </AlertDialogTitle>

              <AlertDialogDescription
                className="
                  text-sm
                  leading-relaxed
                  text-slate-500
                "
              >
                You are about to permanently
                delete{' '}
                <span className="font-semibold text-slate-900">
                  &quot;{taskTitle}&quot;
                </span>
                .
                <br />
                <br />
                This action cannot be undone
                and all associated task
                information will be removed.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div
          className="
            mt-4
            h-px
            bg-linear-to-r
            from-transparent
            via-rose-500/40
            to-transparent
          "
        />

        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel
            disabled={isPending}
            className="
              rounded-2xl
              border-white/20
              bg-white/60
              backdrop-blur-xl
              transition-all
              duration-300
              hover:bg-white/80
            "
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={handleDelete}
            className="
              min-w-[120px]
              rounded-2xl
              bg-rose-500
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:bg-rose-500/90
              hover:shadow-xl
              disabled:opacity-50
            "
          >
            {isPending
              ? 'Deleting...'
              : 'Delete Task'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}