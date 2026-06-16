'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';

import { CategoryForm } from './category-form';

import { useUpdateCategory } from '../hooks/use-update-category';
import type { Category } from '../types/category.types';
import type { CategoryFormValues } from '../schemas/category.schema';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface UpdateCategoryDialogProps {
  category: Category;
}

export function UpdateCategoryDialog({
  category,
}: UpdateCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const updateCategoryMutation =
    useUpdateCategory();

  const handleSubmit = async (
    values: CategoryFormValues,
  ) => {
    await updateCategoryMutation.mutateAsync({
      id: category.id,
      payload: values,
    });

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Update Category
          </DialogTitle>
        </DialogHeader>

        <CategoryForm
          defaultValues={category}
          onSubmit={handleSubmit}
          isLoading={
            updateCategoryMutation.isPending
          }
        />
      </DialogContent>
    </Dialog>
  );
}