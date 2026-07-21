/**
 * ============================================================================
 * File: seed-category.repository.ts
 * ============================================================================
 *
 * Category Seeder Repository
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Provide database operations required by seeders.
 * - Avoid direct TypeORM usage inside seed services.
 * - Keep seed logic isolated.
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Category } from '../../../categories/entities/category.entity';

@Injectable()
export class SeedCategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async exists(name: string, userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        name,

        userId,
      },
    });

    return count > 0;
  }

  async createMany(categories: Partial<Category>[]): Promise<Category[]> {
    const entities = this.repository.create(categories);

    return this.repository.save(entities);
  }
}
