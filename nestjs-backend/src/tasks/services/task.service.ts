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
    In,
    Repository,
} from 'typeorm';

import { Task } from '../entities/task.entity';
import { Tag } from '../../tags/entities/tag.entity';

import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskQueryDto } from '../dto/task-query.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,

        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    async create(
        createTaskDto: CreateTaskDto,
        userId: string,
    ): Promise<Task> {
        const {
            tagIds,
            ...taskData
        } = createTaskDto;

        let tags: Tag[] = [];

        if (
            tagIds &&
            tagIds.length > 0
        ) {
            tags =
                await this.tagRepository.find({
                    where: {
                        id: In(tagIds),
                        userId,
                    },
                });
        }

        const task =
            this.taskRepository.create({
                ...taskData,

                dueDate:
                    createTaskDto.dueDate
                        ? new Date(
                              createTaskDto.dueDate,
                          )
                        : null,

                userId,

                tags,
            });

        return this.taskRepository.save(
            task,
        );
    }

    async findAll(
        query: TaskQueryDto,
        userId: string,
    ): Promise<{
        data: Task[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const {
            page = 1,
            limit = 10,
            status,
            priority,
            search,
            sortBy = 'createdAt',
            sortOrder = 'DESC',
        } = query;

        const where: FindOptionsWhere<Task> = {
            userId,
        };

        if (status) {
            where.status = status;
        }

        if (priority) {
            where.priority = priority;
        }

        if (search) {
            const [data, total] =
                await this.taskRepository.findAndCount({
                    where: [
                        {
                            userId,
                            status,
                            priority,
                            title: ILike(
                                `%${search}%`,
                            ),
                        },
                    ],

                    relations: {
                        category: true,
                        tags: true,
                    },

                    order: {
                        [sortBy]: sortOrder,
                    },

                    skip: (page - 1) * limit,

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
            await this.taskRepository.findAndCount({
                where,

                relations: {
                    category: true,
                    tags: true,
                },

                order: {
                    [sortBy]: sortOrder,
                },

                skip: (page - 1) * limit,

                take: limit,
            });

        return {
            data,
            total,
            page,
            limit,
            totalPages:
                Math.ceil(total / limit),
        };
    }

    async findOne(
        id: string,
        userId: string,
    ): Promise<Task> {
        const task =
            await this.taskRepository.findOne({
                where: {
                    id,
                    userId,
                },

                relations: {
                    category: true,
                    tags: true,
                },
            });

        if (!task) {
            throw new NotFoundException(
                'Task not found',
            );
        }

        return task;
    }

    async update(
        id: string,
        updateTaskDto: UpdateTaskDto,
        userId: string,
    ): Promise<Task> {
        const task =
            await this.findOne(
                id,
                userId,
            );

        const {
            tagIds,
            ...taskData
        } = updateTaskDto;

        Object.assign(task, {
            ...taskData,

            dueDate:
                updateTaskDto.dueDate
                    ? new Date(
                        updateTaskDto.dueDate,
                    )
                    : task.dueDate,
        });

        if (tagIds) {
            task.tags =
                await this.tagRepository.find({
                    where: {
                        id: In(tagIds),
                        userId,
                    },
                });
        }

        return this.taskRepository.save(
            task,
        );
    }

    async remove(
        id: string,
        userId: string,
    ): Promise<void> {
        const task =
            await this.findOne(
                id,
                userId,
            );

        await this.taskRepository.remove(
            task,
        );
    }

    async convertNoteToTask(
        noteId: string,
        title: string,
        description: string | undefined,
        userId: string,
    ): Promise<Task> {
        const task =
            this.taskRepository.create({
                title,

                description,

                userId,

                isConvertedFromNote: true,

                sourceNoteId: noteId,
            });

        return this.taskRepository.save(
            task,
        );
    }
}