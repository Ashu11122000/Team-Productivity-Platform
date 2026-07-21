import { Injectable } from '@nestjs/common';

import { SeedCategoryRepository } from './repositories/seed-category.repository';

import { SeedTagRepository } from './repositories/seed-tag.repository';

import { categoriesSeed } from './categories.seed';

import { tagsSeed } from './tags.seed';

@Injectable()
export class SeedService {
  constructor(
    private readonly categoryRepository: SeedCategoryRepository,

    private readonly tagRepository: SeedTagRepository,
  ) {}

  async run(userId: string): Promise<void> {
    await this.seedCategories(userId);

    await this.seedTags(userId);
  }

  private async seedCategories(userId: string): Promise<void> {
    const categories = categoriesSeed(userId);

    const filtered: ReturnType<typeof categoriesSeed> = [];

    for (const category of categories) {
      const exists = await this.categoryRepository.exists(
        category.name,
        userId,
      );

      if (!exists) {
        filtered.push(category);
      }
    }

    if (filtered.length) {
      await this.categoryRepository.createMany(filtered);
    }
  }

  private async seedTags(userId: string): Promise<void> {
    const tags = tagsSeed(userId);

    const filtered: ReturnType<typeof tagsSeed> = [];

    for (const tag of tags) {
      const exists = await this.tagRepository.exists(tag.name, userId);

      if (!exists) {
        filtered.push(tag);
      }
    }

    if (filtered.length) {
      await this.tagRepository.createMany(filtered);
    }
  }
}
