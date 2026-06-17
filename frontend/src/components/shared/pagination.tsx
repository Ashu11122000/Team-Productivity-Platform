'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;

  totalPages: number;

  onPageChange: (page: number) => void;

  siblingCount?: number;

  className?: string;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
) {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);

  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  const pages: (number | 'dots')[] = [];

  pages.push(1);

  if (showLeftDots) {
    pages.push('dots');
  }

  for (let page = leftSibling; page <= rightSibling; page++) {
    if (page !== 1 && page !== totalPages) {
      pages.push(page);
    }
  }

  if (showRightDots) {
    pages.push('dots');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const pages = React.useMemo(
    () => getPageNumbers(page, totalPages, siblingCount),
    [page, totalPages, siblingCount],
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="text-muted-foreground text-sm">
        Page <span className="text-foreground font-medium">{page}</span> of{' '}
        <span className="text-foreground font-medium">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((item, index) => {
          if (item === 'dots') {
            return (
              <div
                key={`dots-${index}`}
                className="flex h-8 w-8 items-center justify-center"
              >
                <MoreHorizontal className="text-muted-foreground size-4" />
              </div>
            );
          }

          const isActive = item === page;

          return (
            <Button
              key={item}
              size="icon-sm"
              variant={isActive ? 'default' : 'ghost'}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon-sm"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}

export { Pagination };
