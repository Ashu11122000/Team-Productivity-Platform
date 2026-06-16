'use client';

import {
  MoreHorizontal,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

import type { Category } from '../types/category.types';

import { UpdateCategoryDialog } from './update-category-dialog';
import { DeleteCategoryDialog } from './delete-category-dialog';

interface CategoryActionsProps {
  category: Category;
}

export function CategoryActions({
  category,
}: CategoryActionsProps) {
  return (
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
        <DropdownMenuLabel>
          Actions
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="px-2 py-1">
          <UpdateCategoryDialog
            category={category}
          />
        </div>

        <div className="px-2 py-1">
          <DeleteCategoryDialog
            categoryId={
              category.id
            }
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}