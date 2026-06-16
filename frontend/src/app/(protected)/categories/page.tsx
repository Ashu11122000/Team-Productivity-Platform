'use client';

import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import { useCategories } from '@/features/categories/hooks/use-categories';

import { CreateCategoryDialog } from '@/features/categories/components/create-category-dialog';

import { CategoryTable } from '@/features/categories/components/category-table';

import { Input } from '@/components/ui/input';

export default function CategoriesPage() {
  const [search, setSearch] =
    useState('');

  const {
    data,
    isLoading,
    isError,
  } = useCategories();

  const categories =
    data?.data ?? [];

  const filteredCategories =
    categories.filter(
      (category) =>
        category.name
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ) ||
        category.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border p-6">
        Failed to load categories.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Categories
          </h1>

          <p className="text-muted-foreground">
            Manage your task
            categories
          </p>
        </div>

        <CreateCategoryDialog />
      </div>

      <Input
        placeholder="Search categories..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value,
          )
        }
      />

      {filteredCategories.length ===
      0 ? (
        <div className="rounded-md border p-10 text-center">
          <h3 className="font-medium">
            No categories found
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first
            category.
          </p>
        </div>
      ) : (
        <CategoryTable
          categories={
            filteredCategories
          }
        />
      )}
    </div>
  );
}