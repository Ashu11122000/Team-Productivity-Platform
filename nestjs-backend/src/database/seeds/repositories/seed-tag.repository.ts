/*
 * ============================================================================
 * File: seed-tag.repository.ts
 * ============================================================================
 *
 * Tag Seeder Repository
 *
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TagEntity } from '../../../tags/entities/tag.entity';

@Injectable()
export class SeedTagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly repository: Repository<TagEntity>,
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

  async createMany(tags: Partial<TagEntity>[]): Promise<TagEntity[]> {
    const entities = this.repository.create(tags);

    return this.repository.save(entities);
  }
}
