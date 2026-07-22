/**
 * ============================================================================
 * File: tasks.controller.ts
 * ============================================================================
 *
 * Enterprise Tasks Controller.
 *
 * Responsibilities
 * ----------------
 * - Expose REST API endpoints for Tasks.
 * - Validate incoming HTTP requests.
 * - Delegate business logic to TasksService.
 * - Return response DTOs only.
 * - Never contain business logic.
 *
 * Architecture
 * ------------
 * Client
 *      │
 *      ▼
 * TasksController
 *      │
 *      ▼
 * TasksService
 *      │
 *      ▼
 * TasksRepository
 *      │
 *      ▼
 * PostgreSQL
 *
 * Notes
 * -----
 * - FastAPI owns authentication.
 * - NestJS validates JWTs only.
 * - Controllers never access repositories directly.
 * - Controllers never return entities.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * - JWT Authentication
 * ============================================================================
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

import { TasksService } from '../services/task.service';

import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskQueryDto } from '../dto/task-query.dto';
import { TaskResponseDto } from '../dto/task-response.dto';

import { PaginationResult } from '../interfaces/pagination-result.interface';

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * ==========================================================================
   * Create Task
   * ==========================================================================
   *
   * Creates a new task for the authenticated user.
   *
   * Responsibilities
   * ----------------
   * - Validate request body.
   * - Extract authenticated user.
   * - Delegate creation to TasksService.
   * - Return response DTO.
   *
   * @param createTaskDto Task payload.
   * @param user Authenticated user.
   * @returns Created task.
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Creates a new task for the authenticated user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully.',
    type: TaskResponseDto,
  })
  async create(
    @Body()
    createTaskDto: CreateTaskDto,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<TaskResponseDto> {
    return this.tasksService.create(user.sub, createTaskDto);
  }

  /**
   * ==========================================================================
   * Get User Tasks
   * ==========================================================================
   *
   * Returns a paginated list of tasks.
   */
  @Get()
  @ApiOperation({
    summary: 'Get user tasks',
    description:
      'Returns a paginated collection of tasks belonging to the authenticated user.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    required: false,
  })
  @ApiQuery({
    name: 'priority',
    required: false,
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully.',
  })
  async findAll(
    @Query()
    query: TaskQueryDto,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<PaginationResult<TaskResponseDto>> {
    return this.tasksService.findAll(user.sub, query);
  }

  /**
   * ==========================================================================
   * Get Task By ID
   * ==========================================================================
   *
   * Retrieves a single task belonging to the authenticated user.
   *
   * Responsibilities
   * ----------------
   * - Validate the task identifier.
   * - Extract the authenticated user.
   * - Delegate retrieval to TasksService.
   * - Return a response DTO.
   *
   * @param id Task identifier.
   * @param user Authenticated user.
   * @returns Task response.
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get task by ID',
    description: 'Returns a single task belonging to the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task UUID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  async findById(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<TaskResponseDto> {
    return this.tasksService.findById(id, user.sub);
  }

  /**
   * ==========================================================================
   * Update Task
   * ==========================================================================
   *
   * Updates an existing task.
   *
   * Responsibilities
   * ----------------
   * - Validate request body.
   * - Validate task identifier.
   * - Extract authenticated user.
   * - Delegate business logic to TasksService.
   * - Return updated response DTO.
   *
   * @param id Task identifier.
   * @param updateTaskDto Updated task payload.
   * @param user Authenticated user.
   * @returns Updated task.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update task',
    description:
      'Updates an existing task belonging to the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task UUID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  async update(
    @Param('id')
    id: string,

    @Body()
    updateTaskDto: UpdateTaskDto,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(id, user.sub, updateTaskDto);
  }

  /**
   * ==========================================================================
   * Delete Task
   * ==========================================================================
   *
   * Soft deletes a task belonging to the authenticated user.
   *
   * Responsibilities
   * ----------------
   * - Validate task identifier.
   * - Extract authenticated user.
   * - Delegate deletion to TasksService.
   *
   * @param id Task identifier.
   * @param user Authenticated user.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete task',
    description: 'Soft deletes a task belonging to the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task UUID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Task deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  async remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<void> {
    await this.tasksService.remove(id, user.sub);
  }

  /**
   * ==========================================================================
   * Restore Task
   * ==========================================================================
   *
   * Restores a previously soft-deleted task.
   *
   * @param id Task identifier.
   * @param user Authenticated user.
   * @returns Restored task.
   */
  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore task',
    description: 'Restores a previously soft-deleted task.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task UUID.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Task restored successfully.',
    type: TaskResponseDto,
  })
  async restore(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<TaskResponseDto> {
    return this.tasksService.restore(id, user.sub);
  }

  /**
   * ==========================================================================
   * Get Task Summary
   * ==========================================================================
   *
   * Returns aggregated task statistics for the authenticated user.
   *
   * @param user Authenticated user.
   * @returns Task summary.
   */
  @Get('summary')
  @ApiOperation({
    summary: 'Get task summary',
    description:
      'Returns aggregated task statistics for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Task summary retrieved successfully.',
  })
  async getSummary(
    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.tasksService.getSummary(user.sub);
  }

  /**
   * ==========================================================================
   * Count Completed Tasks
   * ==========================================================================
   */
  @Get('count/completed')
  @ApiOperation({
    summary: 'Count completed tasks',
  })
  async countCompleted(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<number> {
    return this.tasksService.countCompleted(user.sub);
  }

  /**
   * ==========================================================================
   * Count Pending Tasks
   * ==========================================================================
   */
  @Get('count/pending')
  @ApiOperation({
    summary: 'Count pending tasks',
  })
  async countPending(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<number> {
    return this.tasksService.countPending(user.sub);
  }

  /**
   * ==========================================================================
   * Count In Progress Tasks
   * ==========================================================================
   */
  @Get('count/in-progress')
  @ApiOperation({
    summary: 'Count in-progress tasks',
  })
  async countInProgress(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<number> {
    return this.tasksService.countInProgress(user.sub);
  }

  /**
   * ==========================================================================
   * Count Overdue Tasks
   * ==========================================================================
   */
  @Get('count/overdue')
  @ApiOperation({
    summary: 'Count overdue tasks',
  })
  async countOverdue(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<number> {
    return this.tasksService.countOverdue(user.sub);
  }
}
