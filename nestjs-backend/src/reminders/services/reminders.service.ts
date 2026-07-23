/* eslint-disable prettier/prettier */

/**
 * ============================================================================
 * File: reminders.service.ts
 * ============================================================================
 *
 * Enterprise Reminders Service
 *
 * Responsibilities
 * ----------------------------------------------------------------------------
 * - Coordinate reminder business operations.
 * - Validate business rules before persistence.
 * - Delegate all persistence operations to RemindersRepository.
 * - Delegate entity-to-DTO transformation to ReminderMapper.
 * - Never expose TypeORM entities outside the service layer.
 * - Keep business logic independent of HTTP and persistence concerns.
 *
 * Design Principles
 * ----------------------------------------------------------------------------
 * - Clean Architecture
 * - Repository Pattern
 * - Mapper Pattern
 * - SOLID
 * - DRY
 * - Single Responsibility Principle
 *
 * Notes
 * ----------------------------------------------------------------------------
 * - FastAPI owns authentication and JWT generation.
 * - NestJS only validates JWTs.
 * - Repository handles persistence.
 * - Mapper handles Entity -> DTO transformation.
 * ============================================================================
 */

import { Injectable } from '@nestjs/common';

import { NotFoundException } from '../../common/exceptions/not-found.exception';

import { CreateReminderDto } from '../dto/create-reminder.dto';
import { ReminderPaginationResponseDto } from '../dto/reminder-pagination-response.dto';
import { ReminderQueryDto } from '../dto/reminder-query.dto';
import { ReminderResponseDto } from '../dto/reminder-response.dto';
import { ReminderStatsDto } from '../dto/reminder-stats.dto';
import { ReminderSummaryDto } from '../dto/reminder-summary.dto';
import { UpdateReminderDto } from '../dto/update-reminder.dto';

import { ReminderEntity } from '../entities/reminder.entity';
import { ReminderStatus } from '../enums/reminder-status.enum';

import { ReminderFilter } from '../interfaces/reminder-filter.interface';

import { ReminderMapper } from '../mappers/reminder.mapper';

import { RemindersRepository } from '../repositories/reminders.repository';

@Injectable()
export class RemindersService {
  constructor(
    private readonly remindersRepository: RemindersRepository,
    private readonly reminderMapper: ReminderMapper,
  ) {}

  /**
   * ==========================================================================
   * Creates a new reminder.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Validate business rules.
   * - Create the persistence entity.
   * - Delegate persistence to the repository.
   * - Return a response DTO.
   *
   * @param userId Authenticated user identifier.
   * @param dto Reminder creation payload.
   * @returns Created reminder.
   */
  public async create(
    userId: number,
    dto: CreateReminderDto,
  ): Promise<ReminderResponseDto> {
    const reminder = new ReminderEntity();

    reminder.userId = userId;

    reminder.title = dto.title;
    reminder.description = dto.description ?? null;

    reminder.type = dto.type;
    // dto.repeat may be optional in the DTO; assert type to satisfy strict checks
    reminder.repeat = dto.repeat as unknown as import('../enums/reminder-repeat.enum').ReminderRepeat;
    reminder.status = ReminderStatus.PENDING;

    reminder.remindAt = dto.remindAt;

    // Ensure a numeric value; default to 0 when not provided to satisfy strict typing
    reminder.reminderOffsetMinutes = dto.reminderOffsetMinutes ?? 0;

    // Ensure boolean values; default to false when undefined to satisfy strict typing
    reminder.sendNotification = dto.sendNotification ?? false;

    reminder.sendEmail = dto.sendEmail ?? false;

    reminder.taskId = dto.taskId ?? null;

    reminder.notificationId = dto.notificationId ?? null;

    reminder.metadata = dto.metadata ?? null;

    const created = await this.remindersRepository.save(reminder);

    return this.reminderMapper.toResponseDto(created);
  }

  /**
   * ==========================================================================
   * Returns a paginated collection of reminders.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Build the repository filter.
   * - Delegate querying to the repository.
   * - Transform entities into response DTOs.
   * - Never expose persistence models.
   *
   * @param userId Authenticated user identifier.
   * @param query Reminder query parameters.
   * @returns Paginated reminder response.
   */
  public async findAll(
    userId: number,
    query: ReminderQueryDto,
  ): Promise<ReminderPaginationResponseDto> {
    const filter = this.createFilter(userId, query);

    const reminders = await this.remindersRepository.findAll(filter);

    return this.reminderMapper.toPaginationResponseDto(reminders);
  }

  /**
   * ==========================================================================
   * Returns a reminder by its identifier.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Ensure the reminder exists.
   * - Ensure the reminder belongs to the authenticated user.
   * - Transform the entity into a response DTO.
   *
   * @param userId Authenticated user identifier.
   * @param id Reminder identifier.
   * @returns Reminder response DTO.
   *
   * @throws NotFoundException
   * When the reminder cannot be found.
   */
  public async findOne(
    userId: number,
    id: string,
  ): Promise<ReminderResponseDto> {
    const reminder = await this.findEntityOrThrow(userId, id);

    return this.reminderMapper.toResponseDto(reminder);
  }

  /**
   * ==========================================================================
   * Updates an existing reminder.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Ensure the reminder exists.
   * - Apply partial updates.
   * - Persist changes through the repository.
   * - Return the updated response DTO.
   *
   * @param userId Authenticated user identifier.
   * @param id Reminder identifier.
   * @param dto Reminder update payload.
   * @returns Updated reminder.
   *
   * @throws NotFoundException
   * When the reminder cannot be found.
   */
  public async update(
    userId: number,
    id: string,
    dto: UpdateReminderDto,
  ): Promise<ReminderResponseDto> {
    const reminder = await this.findEntityOrThrow(userId, id);

    if (dto.title !== undefined) {
      reminder.title = dto.title;
    }

    if (dto.description !== undefined) {
      reminder.description = dto.description;
    }

    if (dto.type !== undefined) {
      reminder.type = dto.type;
    }

    if (dto.repeat !== undefined) {
      reminder.repeat = dto.repeat;
    }

    if (dto.remindAt !== undefined) {
      reminder.remindAt = dto.remindAt;
    }

    if (dto.reminderOffsetMinutes !== undefined) {
      reminder.reminderOffsetMinutes = dto.reminderOffsetMinutes;
    }

    if (dto.sendNotification !== undefined) {
      reminder.sendNotification = dto.sendNotification;
    }

    if (dto.sendEmail !== undefined) {
      reminder.sendEmail = dto.sendEmail;
    }

    if (dto.taskId !== undefined) {
      reminder.taskId = dto.taskId;
    }

    if (dto.notificationId !== undefined) {
      reminder.notificationId = dto.notificationId;
    }

    if (dto.metadata !== undefined) {
      reminder.metadata = dto.metadata;
    }

    const updated = await this.remindersRepository.save(reminder);

    return this.reminderMapper.toResponseDto(updated);
  }

  /**
   * ==========================================================================
   * Soft deletes a reminder.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Ensure the reminder exists.
   * - Delegate soft deletion to the repository.
   *
   * @param userId Authenticated user identifier.
   * @param id Reminder identifier.
   *
   * @throws NotFoundException
   * When the reminder cannot be found.
   */
  public async delete(userId: number, id: string): Promise<void> {
    await this.findEntityOrThrow(userId, id);

    await this.remindersRepository.softDelete(id, userId);
  }

  /**
   * ==========================================================================
   * Restores a soft-deleted reminder.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Ensure the reminder exists (including deleted records).
   * - Delegate restore operation to the repository.
   *
   * @param userId Authenticated user identifier.
   * @param id Reminder identifier.
   *
   * @throws NotFoundException
   * When the reminder cannot be found.
   */
  public async restore(userId: number, id: string): Promise<void> {
    await this.findEntityOrThrow(userId, id, true);

    await this.remindersRepository.restore(id, userId);
  }

  /**
   * ==========================================================================
   * Returns reminder summary information.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Retrieve aggregated reminder summary data.
   * - Delegate aggregation to the repository.
   * - Delegate DTO transformation to the mapper.
   * - Never expose repository models.
   *
   * @param userId Authenticated user identifier.
   * @returns Reminder summary DTO.
   */
  public async getSummary(userId: number): Promise<ReminderSummaryDto> {
    const summary = await this.remindersRepository.getSummary(userId);

    return this.reminderMapper.toSummaryDto(summary);
  }

  /**
   * ==========================================================================
   * Returns reminder statistics.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Retrieve reminder analytics from the repository.
   * - Delegate DTO transformation to the mapper.
   * - Never expose repository models.
   *
   * @param userId Authenticated user identifier.
   * @returns Reminder statistics DTO.
   */
  public async getStats(userId: number): Promise<ReminderStatsDto> {
    const stats = await this.remindersRepository.getStats(userId);

    return this.reminderMapper.toStatsDto(stats);
  }

  /**
   * ==========================================================================
   * Creates a repository filter from the incoming query DTO.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Convert the HTTP request DTO into an internal repository filter.
   * - Separate transport-layer concerns from persistence.
   * - Apply default pagination and sorting values.
   *
   * @param userId Authenticated user identifier.
   * @param query Reminder query DTO.
   * @returns Repository filter.
   */
  private createFilter(
    userId: number,
    query: ReminderQueryDto,
  ): ReminderFilter {
    return {
      userId,

      search: query.search,

      status: query.status,

      type: query.type,

      repeat: query.repeat,

      fromDate: query.fromDate,

      toDate: query.toDate,

      taskId: query.taskId,

      notificationId: query.notificationId,

      overdue: query.overdue,

      includeDeleted: query.includeDeleted,

      page: query.page ?? 1,

      limit: query.limit ?? 20,

      sortBy: query.sortBy ?? 'remindAt',

      sortOrder: query.sortOrder ?? 'ASC',
    };
  }

  /**
   * ==========================================================================
   * Finds a reminder entity or throws a NotFoundException.
   * ==========================================================================
   *
   * Responsibilities
   * --------------------------------------------------------------------------
   * - Centralize reminder lookup.
   * - Enforce user ownership.
   * - Optionally include soft-deleted reminders.
   * - Provide a consistent exception strategy.
   *
   * @param userId Authenticated user identifier.
   * @param id Reminder identifier.
   * @param includeDeleted Whether soft-deleted reminders should be searched.
   * @returns Reminder entity.
   *
   * @throws NotFoundException
   * When the reminder cannot be found.
   */
  private async findEntityOrThrow(
    userId: number,
    id: string,
    includeDeleted = false,
  ): Promise<ReminderEntity> {
    const reminder = await this.remindersRepository.findById(
      id,
      userId,
      includeDeleted,
    );

    if (!reminder) {
      throw new NotFoundException('Reminder not found.');
    }

    return reminder;
  }
}
