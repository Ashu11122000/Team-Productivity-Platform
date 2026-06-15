'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (
    page: number,
  ) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() =>
          onPageChange(page - 1)
        }
      >
        Previous
      </Button>

      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <Button
        variant="outline"
        disabled={
          page >= totalPages
        }
        onClick={() =>
          onPageChange(page + 1)
        }
      >
        Next
      </Button>
    </div>
  );
}