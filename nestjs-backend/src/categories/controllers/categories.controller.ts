/* eslint-disable prettier/prettier */

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

import { CategoriesService } from '../services/categories.service';

import { Category } from '../entities/category.entity';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryQueryDto } from '../dto/category-query.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Categories')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Create Category',
    })
    @ApiResponse({
        status: 201,
        type: Category,
    })
    async create(
        @Body()
        createCategoryDto: CreateCategoryDto,

        @CurrentUser()
        user: JwtPayload,
    ): Promise<Category> {
        return this.categoriesService.create(
            createCategoryDto,
            user.sub,
        );
    }

    @Get()
    @ApiOperation({
        summary: 'Get User Categories',
    })
    @ApiQuery({
        name: 'page',
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
    })
    @ApiQuery({
        name: 'search',
        required: false,
    })
    async findAll(
        @Query()
        query: CategoryQueryDto,

        @CurrentUser()
        user: JwtPayload,
    ) {
        return this.categoriesService.findAll(
            query,
            user.sub,
        );
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get Category By ID',
    })
    @ApiParam({
        name: 'id',
    })
    async findOne(
        @Param('id')
        id: string,

        @CurrentUser()
        user: JwtPayload,
    ): Promise<Category> {
        return this.categoriesService.findOne(
            id,
            user.sub,
        );
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update Category',
    })
    async update(
        @Param('id')
        id: string,

        @Body()
        updateCategoryDto: UpdateCategoryDto,

        @CurrentUser()
        user: JwtPayload,
    ): Promise<Category> {
        return this.categoriesService.update(
            id,
            updateCategoryDto,
            user.sub,
        );
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete Category',
    })
    async remove(
        @Param('id')
        id: string,

        @CurrentUser()
        user: JwtPayload,
    ): Promise<void> {
        return this.categoriesService.remove(
            id,
            user.sub,
        );
    }
}