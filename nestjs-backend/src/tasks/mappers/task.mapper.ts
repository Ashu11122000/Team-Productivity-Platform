/* eslint-disable prettier/prettier */

/**
 * ============================================================================
 * File: task.mapper.ts
 * ============================================================================
 *
 * Enterprise mapper for Task entities.
 *
 * Responsibilities
 * ----------------
 * - Convert TaskEntity objects into API response DTOs.
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
 * TaskEntity
 *      │
 *      ▼
 * TaskMapper
 *      │
 *      ▼
 * TaskResponseDto
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

import { TaskEntity } from '../entities/task.entity';

import {
  TaskCategoryDto,
  TaskResponseDto,
  TaskTagDto,
} from '../dto/task-response.dto';

@Injectable()
export class TaskMapper {
  /**
   * Converts a TaskEntity into a TaskResponseDto.
   *
   * @param entity Task persistence entity.
   * @returns API response DTO.
   */
  toResponseDto(entity: TaskEntity): TaskResponseDto {
    const dto = new TaskResponseDto();

    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description ?? null;

    dto.status = entity.status;
    dto.priority = entity.priority;

    dto.dueDate = entity.dueDate ?? null;

    dto.userId = entity.userId;

    dto.isConvertedFromNote = entity.isConvertedFromNote;
    dto.sourceNoteId = entity.sourceNoteId ?? null;

    dto.category = entity.category ? this.toCategoryDto(entity.category) : null;

    dto.tags = entity.tags?.length
      ? entity.tags.map((tag) => this.toTagDto(tag))
      : [];

    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    return dto;
  }

  /**
   * Converts multiple TaskEntity objects into response DTOs.
   *
   * @param entities Task entities.
   * @returns Array of TaskResponseDto objects.
   */
  toResponseDtoList(entities: TaskEntity[]): TaskResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Maps a CategoryEntity to TaskCategoryDto.
   *
   * @param category Category entity.
   * @returns Lightweight category DTO.
   */
  private toCategoryDto(category: NonNullable<TaskEntity['category']>): TaskCategoryDto {
    const dto = new TaskCategoryDto();

    dto.id = category.id;
    dto.name = category.name;

    return dto;
  }

  /**
   * Maps a TagEntity to TaskTagDto.
   *
   * @param tag Tag entity.
   * @returns Lightweight tag DTO.
   */
  private toTagDto(tag: NonNullable<TaskEntity['tags']>[number]): TaskTagDto {
    const dto = new TaskTagDto();

    dto.id = tag.id;
    dto.name = tag.name;

    return dto;
  }

  /**
   * Safely converts nullable dates.
   *
   * Keeps all date handling centralized.
   */
  private mapNullableDate(value?: Date | null): Date | null {
    return value ?? null;
  }

  /**
   * Safely converts nullable strings.
   *
   * Prevents undefined values from leaking
   * into response DTOs.
   */
  private mapNullableString(value?: string | null): string | null {
    return value ?? null;
  }
}
