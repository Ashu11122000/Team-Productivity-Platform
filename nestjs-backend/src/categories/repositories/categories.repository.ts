/**
 * ============================================================================
 * File: categories.repository.ts
 * ============================================================================
 *
 * Enterprise Categories Repository.
 *
 * Responsibilities
 * ----------------
 * - Encapsulate all database operations for categories.
 * - Hide TypeORM implementation details from the service layer.
 * - Provide reusable query methods.
 * - Centralize persistence logic.
 *
 * Notes
 * -----
 * Business logic MUST NOT exist here.
 * This repository is responsible only for persistence.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * - Node.js 22+
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { Category } from '../entities/category.entity';

/**
 * Enterprise Categories Repository.
 */
@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  /**
   * Creates a new Category entity instance.
   */
  create(payload: Partial<Category>): Category {
    return this.repository.create(payload);
  }

  /**
   * Persists a category.
   */
  async save(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  /**
   * Removes a category.
   */
  async remove(category: Category): Promise<Category> {
    return this.repository.remove(category);
  }

  /**
   * Finds a category by ID and owner.
   */
  async findById(id: string, userId: string): Promise<Category | null> {
    return this.repository.findOne({
      where: {
        id,
        userId,
      },
    });
  }

  /**
   * Finds categories with pagination.
   */
  async findAndCount(options: {
    userId: string;
    search?: string;
    page: number;
    limit: number;
    sortBy: keyof Category;
    sortOrder: 'ASC' | 'DESC';
  }): Promise<[Category[], number]> {
    const { userId, search, page, limit, sortBy, sortOrder } = options;

    const where: FindOptionsWhere<Category> = search
      ? {
          userId,
          name: ILike(`%${search}%`),
        }
      : {
          userId,
        };

    return this.repository.findAndCount({
      where,

      order: {
        [sortBy]: sortOrder,
      },

      skip: (page - 1) * limit,

      take: limit,
    });
  }

  /**
   * Checks whether another category already
   * exists with the same name.
   */
  async existsByName(name: string, userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        name,
        userId,
      },
    });

    return count > 0;
  }
}
