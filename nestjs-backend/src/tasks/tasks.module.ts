import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';

import { TaskEntity } from './entities/task.entity';

import { TasksController } from './controllers/tasks.controller';

import { TasksService } from './services/task.service';

import { TasksRepository } from './repositories/tasks.repository';

import { TaskMapper } from './mappers/task.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, Category, Tag]),

    ActivityLogsModule,
  ],

  controllers: [TasksController],

  providers: [TasksRepository, TaskMapper, TasksService],

  exports: [TasksRepository, TasksService],
})
export class TasksModule {}
