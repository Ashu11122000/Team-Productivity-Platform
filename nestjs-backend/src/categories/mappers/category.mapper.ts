/**
 * ============================================================================
 * File: category.mapper.ts
 * ============================================================================
 *
 * Enterprise Category Mapper.
 *
 * Responsibilities
 * ----------------
 * - Convert entities into API response DTOs.
 * - Prevent exposing persistence models.
 * - Centralize mapping logic.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

import { CategoryResponseDto } from '../dto/category-response.dto';

import { Category } from '../entities/category.entity';

/**
 * Category Mapper.
 */
export class CategoryMapper {
  /**
   * Maps a Category entity into a response DTO.
   */
  static toResponse(category: Category): CategoryResponseDto {
    return {
      id: category.id,

      name: category.name,

      description: category.description,

      color: category.color,

      userId: category.userId,

      createdAt: category.createdAt,

      updatedAt: category.updatedAt,
    };
  }

  /**
   * Maps multiple Category entities.
   */
  static toResponseList(categories: Category[]): CategoryResponseDto[] {
    return categories.map((category) => CategoryMapper.toResponse(category));
  }
}
