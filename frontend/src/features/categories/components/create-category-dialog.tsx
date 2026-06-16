'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { CategoryForm } from './category-form';

import { useCreateCategory } from '../hooks/use-create-category';
import type { CategoryFormValues } from '../schemas/category.schema';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);

  const createCategoryMutation =
    useCreateCategory();

  const handleSubmit = async (
    values: CategoryFormValues,
  ) => {
    await createCategoryMutation.mutateAsync(
      values,
    );

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Create Category
          </DialogTitle>
        </DialogHeader>

        <CategoryForm
          onSubmit={handleSubmit}
          isLoading={
            createCategoryMutation.isPending
          }
        />
      </DialogContent>
    </Dialog>
  );
}