/* eslint-disable prettier/prettier */

import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    InjectRepository,
} from '@nestjs/typeorm';

import {
    FindOptionsWhere,
    ILike,
    Repository,
} from 'typeorm';

import { Category } from '../entities/category.entity';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryQueryDto } from '../dto/category-query.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async create(
        createCategoryDto: CreateCategoryDto,
        userId: string,
    ): Promise<Category> {
        const category =
            this.categoryRepository.create({
                ...createCategoryDto,
                userId,
            });

        return this.categoryRepository.save(
            category,
        );
    }

    async findAll(
        query: CategoryQueryDto,
        userId: string,
    ): Promise<{
        data: Category[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'createdAt',
            sortOrder = 'DESC',
        } = query;

        const where: FindOptionsWhere<Category> = {
            userId,
        };

        if (search) {
            const [data, total] =
                await this.categoryRepository.findAndCount({
                    where: [
                        {
                            userId,
                            name: ILike(
                                `%${search}%`,
                            ),
                        },
                    ],

                    order: {
                        [sortBy]: sortOrder,
                    },

                    skip:
                        (page - 1) * limit,

                    take: limit,
                });

            return {
                data,
                total,
                page,
                limit,
                totalPages:
                    Math.ceil(
                        total / limit,
                    ),
            };
        }

        const [data, total] =
            await this.categoryRepository.findAndCount({
                where,

                order: {
                    [sortBy]: sortOrder,
                },

                skip:
                    (page - 1) * limit,

                take: limit,
            });

        return {
            data,
            total,
            page,
            limit,
            totalPages:
                Math.ceil(
                    total / limit,
                ),
        };
    }

    async findOne(
        id: string,
        userId: string,
    ): Promise<Category> {
        const category =
            await this.categoryRepository.findOne({
                where: {
                    id,
                    userId,
                },
            });

        if (!category) {
            throw new NotFoundException(
                'Category not found',
            );
        }

        return category;
    }

    async update(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
        userId: string,
    ): Promise<Category> {
        const category =
            await this.findOne(
                id,
                userId,
            );

        Object.assign(
            category,
            updateCategoryDto,
        );

        return this.categoryRepository.save(
            category,
        );
    }

    async remove(
        id: string,
        userId: string,
    ): Promise<void> {
        const category =
            await this.findOne(
                id,
                userId,
            );

        await this.categoryRepository.remove(
            category,
        );
    }
}