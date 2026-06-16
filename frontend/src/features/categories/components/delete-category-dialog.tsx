'use client';

import { Trash2 } from 'lucide-react';

import { useDeleteCategory } from '../hooks/use-delete-category';

import { Button } from '@/components/ui/button';

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
} from '@/components/ui/alert-dialog';

interface DeleteCategoryDialogProps {
  categoryId: string;
}

export function DeleteCategoryDialog({
  categoryId,
}: DeleteCategoryDialogProps) {
  const deleteCategoryMutation =
    useDeleteCategory();

  const handleDelete =
    async () => {
      await deleteCategoryMutation.mutateAsync(
        categoryId,
      );
    };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Category?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be
            undone. This category
            will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={
              deleteCategoryMutation.isPending
            }
          >
            {deleteCategoryMutation.isPending
              ? 'Deleting...'
              : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}