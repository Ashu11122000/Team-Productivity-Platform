/**
 * ============================================================================
 * File: tag.mapper.ts
 * ============================================================================
 *
 * Enterprise mapper for Tag entities.
 *
 * Responsibilities
 * ----------------
 * - Convert TagEntity objects into API response DTOs.
 * - Hide persistence-layer implementation details.
 * - Prevent entity leakage outside the Repository/Service layers.
 * - Perform null-safe mapping.
 * - Keep controllers and services free from mapping logic.
 *
 * Architecture
 * ------------
 * Repository
 *      │
 *      ▼
 * TagEntity
 *      │
 *      ▼
 * TagMapper
 *      │
 *      ▼
 * TagResponseDto
 *
 * Notes
 * -----
 * - Contains NO business logic.
 * - Contains NO database queries.
 * - Contains NO validation logic.
 * - Responsible only for object transformation.
 *
 * Compatible With
 * ---------------
 * - NestJS 11
 * - TypeScript 5+
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { TagEntity } from '../entities/tag.entity';

import { TagResponseDto } from '../dto/tag-response.dto';

/**
 * Enterprise mapper responsible for converting
 * TagEntity objects into response DTOs.
 */
@Injectable()
export class TagMapper {
  /**
   * Converts a TagEntity into a TagResponseDto.
   *
   * @param entity Tag persistence entity.
   * @returns API response DTO.
   */
  toResponseDto(entity: TagEntity): TagResponseDto {
    return Object.assign(new TagResponseDto(), {
      id: entity.id,
      name: entity.name,
      color: this.mapNullableString(entity.color),
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Converts multiple TagEntity objects into response DTOs.
   *
   * @param entities Tag entities.
   * @returns Array of TagResponseDto objects.
   */
  toResponseDtoList(entities: TagEntity[]): TagResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Safely converts nullable strings.
   *
   * Prevents undefined values from leaking
   * into response DTOs.
   *
   * @param value Nullable string.
   * @returns Normalized string or null.
   */
  private mapNullableString(value?: string | null): string | null {
    return value ?? null;
  }
}
