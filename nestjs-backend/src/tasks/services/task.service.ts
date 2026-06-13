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

import { Task } from '../entities/task.entity';

import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskQueryDto } from '../dto/task-query.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) {}

    async create(
        createTaskDto: CreateTaskDto,
        userId: string,
    ): Promise<Task> {
        const task = this.taskRepository.create({
            ...createTaskDto,

            dueDate: createTaskDto.dueDate
                ? new Date(createTaskDto.dueDate)
                : null,

            userId,
        });

        const savedTask =
            await this.taskRepository.save(task);

        /**
         * Phase 8
         * ActivityLogsService Integration
         */

        return savedTask;
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
                            title: ILike(`%${search}%`),
                        },
                    ],

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

        const [data, total] =
            await this.taskRepository.findAndCount({
                where,

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

        Object.assign(task, {
            ...updateTaskDto,

            dueDate:
                updateTaskDto.dueDate
                    ? new Date(
                        updateTaskDto.dueDate,
                    )
                    : task.dueDate,
        });

        const updatedTask =
            await this.taskRepository.save(task);

        /**
         * Phase 8
         * ActivityLogsService Integration
         */

        return updatedTask;
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

        /**
         * Phase 8
         * ActivityLogsService Integration
         */
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

        const savedTask =
            await this.taskRepository.save(
                task,
            );

        /**
         * Phase 8
         * ActivityLogsService Integration
         */

        return savedTask;
    }
}