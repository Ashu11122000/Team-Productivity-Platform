/* eslint-disable prettier/prettier */

/**
 * ============================================================================
 * File: categories.controller.ts
 * ============================================================================
 *
 * Enterprise Categories Controller.
 *
 * Responsibilities
 * ----------------
 * - Handle HTTP requests related to category management.
 * - Validate incoming requests.
 * - Authenticate users.
 * - Delegate business logic to CategoriesService.
 * - Return standardized API responses.
 *
 * Business logic intentionally belongs in the service layer.
 *
 * Notes
 * -----
 * - Every endpoint requires JWT authentication.
 * - JWTs are issued by the FastAPI authentication service.
 * - NestJS only validates JWTs.
 * - Categories are always scoped to the authenticated user.
 *
 * Compatible With
 * ----------------
 * - NestJS 11
 * - TypeORM 0.3+
 * - PostgreSQL
 * - Swagger
 * - Node.js 22+
 * ============================================================================
 */

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators';

import type { JwtPayload } from '../../common/interfaces';

import { Category } from '../entities/category.entity';

import { CreateCategoryDto } from '../dto/create-category.dto';

import { CategoryQueryDto } from '../dto/category-query.dto';

import { CategoriesService } from '../services/categories.service';
import { ParseUuidPipe } from '../../common/pipes';
import { UpdateCategoryDto } from '../dto/update-category.dto';

/**
 * ============================================================================
 * Categories Controller
 * ============================================================================
 *
 * All endpoints are protected by JWT authentication.
 * Each operation is executed within the context of the
 * authenticated user.
 * ============================================================================
 */
@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  /**
   * --------------------------------------------------------------------------
   * Constructor
   * --------------------------------------------------------------------------
   */

  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * ==========================================================================
   * Create Category
   * ==========================================================================
   *
   * Creates a new category belonging to the authenticated user.
   *
   * @param createCategoryDto Category creation payload.
   * @param user Authenticated JWT user.
   *
   * @returns Newly created category.
   * ==========================================================================
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a category for the authenticated user.',
  })
  @ApiCreatedResponse({
    description: 'Category created successfully.',
    type: Category,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  async create(
    @Body()
    createCategoryDto: CreateCategoryDto,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<any> {
    return this.categoriesService.create(createCategoryDto, user.sub);
  }

  /**
   * ==========================================================================
   * Get Categories
   * ==========================================================================
   *
   * Returns paginated categories belonging to the authenticated user.
   *
   * Supports:
   * - Pagination
   * - Searching
   * - Future filtering
   *
   * @param query Query parameters.
   * @param user Authenticated JWT user.
   *
   * @returns Paginated category collection.
   * ==========================================================================
   */
  @Get()
  @ApiOperation({
    summary: 'Retrieve categories',
    description: 'Returns paginated categories for the authenticated user.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search categories by name.',
  })
  @ApiOkResponse({
    description: 'Categories retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  async findAll(
    @Query()
    query: CategoryQueryDto,

    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.categoriesService.findAll(query, user.sub);
  }

  /**
   * ==========================================================================
   * Get Category By ID
   * ==========================================================================
   *
   * Retrieves a single category owned by the authenticated user.
   *
   * @param id Category UUID.
   * @param user Authenticated JWT user.
   *
   * @returns Category.
   * ==========================================================================
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve category by ID',
    description:
      'Returns a single category belonging to the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Category retrieved successfully.',
    type: Category,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  async findOne(
    @Param('id', ParseUuidPipe)
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<any> {
    return this.categoriesService.findOne(id, user.sub);
  }

  /**
   * ==========================================================================
   * Update Category
   * ==========================================================================
   *
   * Updates an existing category belonging to the authenticated user.
   *
   * @param id Category UUID.
   * @param updateCategoryDto Updated category data.
   * @param user Authenticated JWT user.
   *
   * @returns Updated category.
   * ==========================================================================
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update category',
    description:
      'Updates an existing category owned by the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Category updated successfully.',
    type: Category,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  async update(
    @Param('id', ParseUuidPipe)
    id: string,

    @Body()
    updateCategoryDto: UpdateCategoryDto,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<any> {
    return this.categoriesService.update(id, updateCategoryDto, user.sub);
  }

  /**
   * ==========================================================================
   * Delete Category
   * ==========================================================================
   *
   * Deletes a category belonging to the authenticated user.
   *
   * @param id Category UUID.
   * @param user Authenticated JWT user.
   *
   * @returns Void.
   * ==========================================================================
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete category',
    description: 'Deletes a category belonging to the authenticated user.',
  })
  @ApiNoContentResponse({
    description: 'Category deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  async remove(
    @Param('id', ParseUuidPipe)
    id: string,

    @CurrentUser()
    user: JwtPayload,
  ): Promise<void> {
    return this.categoriesService.remove(id, user.sub);
  }
}
