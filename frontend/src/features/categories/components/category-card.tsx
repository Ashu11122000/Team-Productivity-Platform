'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import type { Category } from '../types/category.types';

import { CategoryActions } from './category-actions';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({
  category,
}: CategoryCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">
              {category.name}
            </h3>

            {category.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {
                  category.description
                }
              </p>
            )}
          </div>

          <CategoryActions
            category={category}
          />
        </div>

        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full border"
            style={{
              backgroundColor:
                category.color ||
                '#3b82f6',
            }}
          />

          <span className="text-sm text-muted-foreground">
            {category.color ||
              'No color'}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Created{' '}
          {new Date(
            category.createdAt,
          ).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}