'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Category } from '../types/category.types';

import { CategoryActions } from './category-actions';

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({
  categories,
}: CategoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            Name
          </TableHead>

          <TableHead>
            Description
          </TableHead>

          <TableHead>
            Color
          </TableHead>

          <TableHead>
            Created
          </TableHead>

          <TableHead>
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.length ===
        0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center"
            >
              No categories found
            </TableCell>
          </TableRow>
        ) : (
          categories.map(
            (category) => (
              <TableRow
                key={
                  category.id
                }
              >
                <TableCell>
                  {
                    category.name
                  }
                </TableCell>

                <TableCell>
                  {category.description ||
                    '-'}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full border"
                      style={{
                        backgroundColor:
                          category.color ||
                          '#3b82f6',
                      }}
                    />

                    <span>
                      {category.color ||
                        '-'}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  {new Date(
                    category.createdAt,
                  ).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <CategoryActions
                    category={
                      category
                    }
                  />
                </TableCell>
              </TableRow>
            ),
          )
        )}
      </TableBody>
    </Table>
  );
}