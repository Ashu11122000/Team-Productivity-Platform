export interface PaginationParams {
  page: number;
  limit: number;
}

export function getPaginationOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function getTotalPages(totalItems: number, limit: number): number {
  return Math.ceil(totalItems / limit);
}

export function hasNextPage(page: number, totalPages: number): boolean {
  return page < totalPages;
}

export function hasPreviousPage(page: number): boolean {
  return page > 1;
}
