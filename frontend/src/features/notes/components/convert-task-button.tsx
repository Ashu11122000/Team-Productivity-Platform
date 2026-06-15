'use client';

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
      variant="secondary"
      disabled={
        isConverted ||
        mutation.isPending
      }
      onClick={handleConvert}
    >
      {isConverted
        ? 'Converted'
        : mutation.isPending
        ? 'Converting...'
        : 'Convert To Task'}
    </Button>
  );
}