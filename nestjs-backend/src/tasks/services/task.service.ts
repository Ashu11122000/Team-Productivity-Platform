/* eslint-disable prettier/prettier */

/**
 * ============================================================================
 * File: tasks.service.ts
 * ============================================================================
 *
 * Enterprise Tasks Service.
 *
 * Responsibilities
 * ----------------
 * - Coordinate task business operations.
 * - Enforce business rules.
 * - Delegate persistence to TasksRepository.
 * - Delegate DTO mapping to TaskMapper.
 * - Record activity logs.
 * - Never expose entities outside the service layer.
 *
 * Architecture
 * ------------
 * Controller
 *      │
 *      ▼
 * TasksService
 *      │
 *      ├────────────► TasksRepository
 *      │
 *      ├────────────► TaskMapper
 *      │
 *      └────────────► ActivityLogsService
 *
 * Notes
 * -----
 * - Contains business logic only.
 * - No QueryBuilder logic.
 * - No TypeORM persistence logic.
 * - FastAPI owns authentication.
 * - NestJS only validates JWTs.
 *
 * Future Improvements
 * -------------------
 * - Notifications integration.
 * - Calendar reminders.
 * - Domain events.
 * - WebSocket broadcasting.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * ============================================================================
 */

import { ConflictException, Injectable, Logger } from '@nestjs/common';

import { ActivityAction, ActivityEntityType } from '../../common/enums';

import { ActivityLogsService } from '../../activity-logs/services/activity-logs.service';

// import { CreateActivityLogDto } from '../../activity-logs/dto/create-activity-log.dto';

import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskQueryDto } from '../dto/task-query.dto';
import { TaskResponseDto } from '../dto/task-response.dto';

import { TaskEntity } from '../entities/task.entity';

import { PaginationResult } from '../interfaces/pagination-result.interface';
import { TaskFilter } from '../interfaces/task-filter.interface';
import { TaskSummary } from '../interfaces/task-summary.interface';

import { TaskMapper } from '../mappers/task.mapper';
import { TasksRepository } from '../repositories/tasks.repository';

/**
 * ============================================================================
 * Enterprise Tasks Service
 * ============================================================================
 *
 * Business orchestration layer for Tasks.
 *
 * Responsibilities
 * ----------------
 * - Validate business rules.
 * - Coordinate repository operations.
 * - Coordinate mapper operations.
 * - Record activity logs.
 * - Return DTOs only.
 *
 * Repository handles persistence.
 * Mapper handles Entity → DTO conversion.
 * ============================================================================
 */
@Injectable()
export class TasksService {
  /**
   * Application logger.
   */
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskMapper: TaskMapper,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  /**
   * ==========================================================================
   * Create Task
   * ==========================================================================
   *
   * Creates a new task.
   *
   * Business Rules
   * --------------
   * - Prevent duplicate task titles.
   * - Prevent duplicate Note → Task conversion.
   * - Repository performs persistence.
   * - Mapper converts entity to DTO.
   * - Activity log recorded after successful creation.
   *
   * TODO
   * ----
   * - Validate Category existence.
   * - Validate Tags.
   * - Trigger Notifications.
   *
   * @param userId Authenticated user identifier.
   * @param createTaskDto Incoming task payload.
   * @returns Created task response.
   */
  async create(
    userId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    this.logger.log(
      `Creating task "${createTaskDto.title}" for user "${userId}".`,
    );

    const duplicateTitle = await this.tasksRepository.existsByTitle(
      createTaskDto.title,
      userId,
    );

    if (duplicateTitle) {
      throw new ConflictException(
        `Task "${createTaskDto.title}" already exists.`,
      );
    }

    if (createTaskDto.sourceNoteId) {
      const existingTask = await this.tasksRepository.findBySourceNoteId(
        createTaskDto.sourceNoteId,
        userId,
      );

      if (existingTask) {
        throw new ConflictException(
          'This note has already been converted into a task.',
        );
      }
    }

    /**
     * TODO:
     * Validate Categories module once it has been
     * refactored.
     */

    /**
     * TODO:
     * Validate Tags module once it has been
     * refactored.
     */

    const payload: Partial<TaskEntity> = {
      ...createTaskDto,
      dueDate: createTaskDto.dueDate
        ? new Date(createTaskDto.dueDate)
        : undefined,
      userId,
    };

    const task = await this.tasksRepository.createTask(payload);

    await this.activityLogsService.log({
      action: ActivityAction.TASK_CREATED,
      entityType: ActivityEntityType.TASK,
      entityId: task.id,
      userId,
    });

    /**
     * TODO:
     * Dispatch notification after Notifications
     * module has been refactored.
     */

    this.logger.log(`Task "${task.id}" created successfully.`);

    return this.taskMapper.toResponseDto(task);
  }

  /**
   * ==========================================================================
   * Find All Tasks
   * ==========================================================================
   *
   * Returns a paginated collection of tasks belonging to the authenticated
   * user.
   *
   * Responsibilities
   * ----------------
   * - Build the repository filter contract.
   * - Delegate filtering, searching, sorting and pagination to the repository.
   * - Map entities into response DTOs.
   * - Return a standardized pagination response.
   *
   * @param userId Authenticated user identifier.
   * @param query Query parameters.
   * @returns Paginated task response.
   */
  async findAll(
    userId: string,
    query: TaskQueryDto,
  ): Promise<PaginationResult<TaskResponseDto>> {
    this.logger.debug(`Fetching tasks for user "${userId}".`);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: TaskFilter = {
      userId,

      page,
      limit,

      skip: (page - 1) * limit,

      includeDeleted: (query as any).includeDeleted ?? false,

      search: query.search,

      status: query.status,
      priority: query.priority,

      // Some query properties are optional and not defined on TaskQueryDto
      // Cast to any to avoid TS errors when DTO doesn't include these fields.
      categoryId: (query as any).categoryId,
      tagIds: (query as any).tagIds,

      dueDateFrom: (query as any).dueDateFrom,
      dueDateTo: (query as any).dueDateTo,

      completed: (query as any).completed,
      overdue: (query as any).overdue,

      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    const result = await this.tasksRepository.findAll(filter);

    return {
      ...result,
      data: this.taskMapper.toResponseDtoList(result.data),
    };
  }

  /**
   * ==========================================================================
   * Find Task By Id
   * ==========================================================================
   *
   * Retrieves a single task.
   *
   * Responsibilities
   * ----------------
   * - Ensure the task exists.
   * - Delegate lookup to the repository.
   * - Return mapped DTO.
   *
   * @param id Task identifier.
   * @param userId Authenticated user identifier.
   * @returns Task response.
   */
  async findById(id: string, userId: string): Promise<TaskResponseDto> {
    this.logger.debug(`Fetching task "${id}".`);

    const task = await this.tasksRepository.findByIdOrFail(id, userId);

    return this.taskMapper.toResponseDto(task);
  }

  /**
   * ==========================================================================
   * Update Task
   * ==========================================================================
   *
   * Updates an existing task.
   *
   * Business Rules
   * --------------
   * - Task must exist.
   * - Updated title must remain unique.
   * - Repository performs persistence.
   * - Mapper converts entity to DTO.
   * - Activity log recorded after successful update.
   *
   * TODO
   * ----
   * - Validate Categories.
   * - Validate Tags.
   * - Trigger Notifications.
   *
   * @param id Task identifier.
   * @param userId Authenticated user identifier.
   * @param updateTaskDto Updated payload.
   * @returns Updated task response.
   */
  async update(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Updating task "${id}".`);

    const task = await this.tasksRepository.findByIdOrFail(id, userId);

    if (updateTaskDto.title && updateTaskDto.title !== task.title) {
      const duplicateTitle = await this.tasksRepository.existsByTitle(
        updateTaskDto.title,
        userId,
      );

      if (duplicateTitle) {
        throw new ConflictException(
          `Task "${updateTaskDto.title}" already exists.`,
        );
      }
    }

    /**
     * TODO:
     * Validate Categories module after it has been
     * refactored.
     */

    /**
     * TODO:
     * Validate Tags module after it has been
     * refactored.
     */

    // Ensure dueDate (string in DTO) is converted to Date for TaskEntity
    const updatePayload = {
      ...updateTaskDto,
      dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
    } as Partial<TaskEntity>;

    const updatedTask = await this.tasksRepository.updateTask(task, updatePayload);

    await this.activityLogsService.log({
      action: ActivityAction.TASK_UPDATED,
      entityType: ActivityEntityType.TASK,
      entityId: updatedTask.id,
      userId,
    });

    /**
     * TODO:
     * Dispatch notification after Notifications
     * module has been refactored.
     */

    this.logger.log(`Task "${updatedTask.id}" updated successfully.`);

    return this.taskMapper.toResponseDto(updatedTask);
  }

  /**
   * ==========================================================================
   * Remove Task
   * ==========================================================================
   *
   * Soft deletes an existing task.
   *
   * Business Rules
   * --------------
   * - Task must exist.
   * - Repository performs soft deletion.
   * - Activity log recorded after successful deletion.
   *
   * TODO
   * ----
   * - Trigger Notifications module.
   * - Publish domain events.
   *
   * @param id Task identifier.
   * @param userId Authenticated user identifier.
   */
  async remove(id: string, userId: string): Promise<void> {
    this.logger.log(`Deleting task "${id}".`);

    const task = await this.tasksRepository.findByIdOrFail(id, userId);

    await this.tasksRepository.softDelete(task);

    await this.activityLogsService.log({
      action: ActivityAction.TASK_DELETED,
      entityType: ActivityEntityType.TASK,
      entityId: task.id,
      userId,
    });

    /**
     * TODO:
     * Dispatch notification after Notifications
     * module has been refactored.
     */

    this.logger.log(`Task "${task.id}" deleted successfully.`);
  }

  /**
   * ==========================================================================
   * Restore Task
   * ==========================================================================
   *
   * Restores a previously soft-deleted task.
   *
   * Business Rules
   * --------------
   * - Task must exist.
   * - Include deleted records during lookup.
   * - Repository performs restoration.
   * - Activity log recorded after successful restoration.
   *
   * @param id Task identifier.
   * @param userId Authenticated user identifier.
   * @returns Restored task response.
   */
  async restore(id: string, userId: string): Promise<TaskResponseDto> {
    this.logger.log(`Restoring task "${id}".`);

    const task = await this.tasksRepository.findByIdOrFail(id, userId, true);

    const restoredTask = await this.tasksRepository.restore(task);

    await this.activityLogsService.log({
      action: ActivityAction.TASK_UPDATED,
      entityType: ActivityEntityType.TASK,
      entityId: restoredTask.id,
      userId,
    });

    /**
     * TODO:
     * Dispatch notification after Notifications
     * module has been refactored.
     */

    this.logger.log(`Task "${restoredTask.id}" restored successfully.`);

    return this.taskMapper.toResponseDto(restoredTask);
  }

  /**
   * ==========================================================================
   * Get Task Summary
   * ==========================================================================
   *
   * Returns task summary statistics for the authenticated user.
   *
   * @param userId Authenticated user identifier.
   * @returns Task summary.
   */
  async getSummary(userId: string): Promise<TaskSummary> {
    this.logger.debug(`Fetching task summary for "${userId}".`);

    return this.tasksRepository.getSummary(userId);
  }

  /**
   * ==========================================================================
   * Count Completed Tasks
   * ==========================================================================
   */
  async countCompleted(userId: string): Promise<number> {
    return this.tasksRepository.countCompletedTasks(userId);
  }

  /**
   * ==========================================================================
   * Count Pending Tasks
   * ==========================================================================
   */
  async countPending(userId: string): Promise<number> {
    return this.tasksRepository.countPendingTasks(userId);
  }

  /**
   * ==========================================================================
   * Count In Progress Tasks
   * ==========================================================================
   */
  async countInProgress(userId: string): Promise<number> {
    return this.tasksRepository.countInProgressTasks(userId);
  }

  /**
   * ==========================================================================
   * Count Overdue Tasks
   * ==========================================================================
   */
  async countOverdue(userId: string): Promise<number> {
    return this.tasksRepository.countOverdueTasks(userId);
  }
}
