/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from './entities/task.entity';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';

import { TasksController } from './controllers/tasks.controller';

import { TasksService } from './services/task.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Task,
            Category,
            Tag,
        ]),
    ],

    controllers: [
        TasksController,
    ],

    providers: [
        TasksService,
    ],

    exports: [
        TasksService,
    ],
})
export class TasksModule {}