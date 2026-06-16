export interface Category {
  id: string;

  name: string;

  description: string | null;

  color: string | null;

  userId: string;

  createdAt: string;

  updatedAt: string;
}

export interface CategoriesResponse {
  data: Category[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export interface CategoryResponse {
  success: boolean;

  data: Category;
}

export interface CategoryQueryParams {
  page?: number;

  limit?: number;

  search?: string;

  sortBy?: string;

  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateCategoryRequest {
  name: string;

  description?: string;

  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;

  description?: string;

  color?: string;
}
