/**
 * ============================================================================
 * File: tags.controller.ts
 * ============================================================================
 *
 * Enterprise Tags Controller.
 *
 * Responsibilities
 * ----------------
 * - Handle HTTP requests related to tags.
 * - Validate incoming DTOs through NestJS pipeline.
 * - Extract authenticated user from JWT.
 * - Delegate business logic to TagsService.
 * - Return response DTOs only.
 *
 * Notes
 * -----
 * - Controllers contain NO business logic.
 * - Controllers never access repositories directly.
 * - Controllers never return database entities.
 *
 * Architecture
 * ------------
 * HTTP Request
 *      │
 *      ▼
 * Controller
 *      │
 *      ▼
 * TagsService
 *      │
 *      ▼
 * TagsRepository
 *      │
 *      ▼
 * PostgreSQL
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - Swagger
 * - TypeScript 5+
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

import { TagsService } from '../services/tags.service';

import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagQueryDto } from '../dto/tag-query.dto';

import { TagResponseDto } from '../dto/tag-response.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Tags')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  /**
   * Create a new tag.
   */
  @Post()
  @ApiOperation({
    summary: 'Create Tag',
    description: 'Creates a new tag for the authenticated user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tag created successfully.',
    type: TagResponseDto,
  })
  async create(
    @Body()
    createTagDto: CreateTagDto,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<TagResponseDto> {
    return this.tagsService.create(createTagDto, user.sub);
  }

  /**
   * Get paginated user tags.
   */
  @Get()
  @ApiOperation({
    summary: 'Get User Tags',
    description: 'Returns paginated tags belonging to the authenticated user.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'backend',
  })
  @ApiResponse({
    status: 200,
    description: 'Tags retrieved successfully.',
  })
  async findAll(
    @Query()
    query: TagQueryDto,

    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.tagsService.findAll(query, user.sub);
  }

  /**
   * Get single tag by identifier.
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get Tag By ID',
    description: 'Retrieves a single tag belonging to the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tag UUID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag retrieved successfully.',
    type: TagResponseDto,
  })
  async findOne(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<TagResponseDto> {
    return this.tagsService.findOne(id, user.sub);
  }

  /**
   * Update existing tag.
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update Tag',
    description: 'Updates an existing user tag.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tag UUID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag updated successfully.',
    type: TagResponseDto,
  })
  async update(
    @Param('id')
    id: string,

    @Body()
    updateTagDto: UpdateTagDto,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<TagResponseDto> {
    return this.tagsService.update(id, updateTagDto, user.sub);
  }

  /**
   * Soft delete tag.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Tag',
    description: 'Soft deletes an existing tag.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tag UUID.',
  })
  @ApiResponse({
    status: 204,
    description: 'Tag deleted successfully.',
  })
  async remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<void> {
    return this.tagsService.remove(id, user.sub);
  }

  /**
   * Restore deleted tag.
   */
  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restore Tag',
    description: 'Restores a previously deleted tag.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tag UUID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tag restored successfully.',
    type: TagResponseDto,
  })
  async restore(
    @Param('id')
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<TagResponseDto> {
    return this.tagsService.restore(id, user.sub);
  }
}
