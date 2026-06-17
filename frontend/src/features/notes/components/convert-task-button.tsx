'use client';

import { ArrowRightLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { useConvertNoteToTask } from '../hooks/use-convert-note-to-task';

interface ConvertTaskButtonProps {
  noteId: number;
  isConverted: boolean;
}

export function ConvertTaskButton({
  noteId,
  isConverted,
}: ConvertTaskButtonProps) {
  const mutation =
    useConvertNoteToTask();

  async function handleConvert() {
    try {
      await mutation.mutateAsync(
        noteId,
      );

      toast.success(
        'Task created successfully',
      );
    } catch {
      toast.error(
        'Failed to convert note',
      );
    }
  }

  return (
    <Button
      size="sm"
      disabled={
        isConverted ||
        mutation.isPending
      }
      onClick={handleConvert}
      aria-label="Convert note to task"
      className={
        isConverted
          ? `
            rounded-2xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            text-emerald-700
            shadow-sm
            hover:bg-emerald-500/10
          `
          : `
            rounded-2xl
            border-0
            bg-linear-to-r
            from-indigo-500
            via-violet-500
            to-cyan-500
            text-white
            shadow-lg
            shadow-indigo-500/25
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-xl
            hover:shadow-violet-500/30
          `
      }
    >
      {isConverted ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Converted
        </>
      ) : mutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Converting...
        </>
      ) : (
        <>
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Convert To Task
        </>
      )}
    </Button>
  );
}