/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';

import { CategoriesController } from './controllers/categories.controller';

import { CategoriesService } from './services/categories.service';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Category,
        ]),

        ActivityLogsModule,
    ],

    controllers: [
        CategoriesController,
    ],

    providers: [
        CategoriesService,
    ],

    exports: [
        CategoriesService,
    ],
})
export class CategoriesModule {}