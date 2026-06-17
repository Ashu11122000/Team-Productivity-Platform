'use client';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

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

  const startPage = Math.max(
    1,
    page - 2,
  );

  const endPage = Math.min(
    totalPages,
    page + 2,
  );

  const pages = [];

  for (
    let i = startPage;
    i <= endPage;
    i++
  ) {
    pages.push(i);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-4 backdrop-blur-xl shadow-lg">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-linear-to-r from-cyan-400/5 via-violet-400/5 to-indigo-400/5" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Page Info */}
        <div>
          <p className="text-sm font-medium text-slate-900">
            Page{' '}
            <span className="font-bold">
              {page}
            </span>{' '}
            of{' '}
            <span className="font-bold">
              {totalPages}
            </span>
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Navigate through your tasks
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() =>
              onPageChange(page - 1)
            }
            className="h-11 rounded-2xl border-white/20 bg-white/60 backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-md disabled:opacity-50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="hidden items-center gap-2 sm:flex">
            {pages.map((pageNumber) => (
              <Button
                key={pageNumber}
                variant="ghost"
                onClick={() =>
                  onPageChange(
                    pageNumber,
                  )
                }
                className={
                  pageNumber === page
                    ? 'h-11 min-w-11 rounded-2xl bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500 font-semibold text-white shadow-lg hover:text-white'
                    : 'h-11 min-w-11 rounded-2xl text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900'
                }
              >
                {pageNumber}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            disabled={
              page >= totalPages
            }
            onClick={() =>
              onPageChange(page + 1)
            }
            className="h-11 rounded-2xl border-white/20 bg-white/60 backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-md disabled:opacity-50"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Accent Divider */}
      <div className="mt-4 h-px bg-linear-to-r from-transparent via-cyan-500/70 to-transparent" />
    </div>
  );
}