/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { AnalyticsService } from '../../../src/analytics/services/analytics.service';

import { Task } from '../../../src/tasks/entities/task.entity';
import { Category } from '../../../src/categories/entities/category.entity';
import { Tag } from '../../../src/tags/entities/tag.entity';
import { Notification } from '../../../src/notifications/entities/notification.entity';

// import { TaskStatus } from '../../../src/common/enums/task-status.enum';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  let taskRepository: jest.Mocked<Repository<Task>>;
  let categoryRepository: jest.Mocked<Repository<Category>>;
  let tagRepository: jest.Mocked<Repository<Tag>>;
  let notificationRepository: jest.Mocked<Repository<Notification>>;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          AnalyticsService,

          {
            provide: getRepositoryToken(Task),
            useValue: {
              count: jest.fn(),
            },
          },

          {
            provide: getRepositoryToken(Category),
            useValue: {
              count: jest.fn(),
            },
          },

          {
            provide: getRepositoryToken(Tag),
            useValue: {
              count: jest.fn(),
            },
          },

          {
            provide: getRepositoryToken(Notification),
            useValue: {
              count: jest.fn(),
            },
          },
        ],
      }).compile();

    service =
      module.get<AnalyticsService>(
        AnalyticsService,
      );

    taskRepository =
      module.get(
        getRepositoryToken(Task),
      );

    categoryRepository =
      module.get(
        getRepositoryToken(Category),
      );

    tagRepository =
      module.get(
        getRepositoryToken(Tag),
      );

    notificationRepository =
      module.get(
        getRepositoryToken(Notification),
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOverview', () => {
    it('should return overview statistics', async () => {
      taskRepository.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(4);

      categoryRepository.count.mockResolvedValue(3);

      tagRepository.count.mockResolvedValue(5);

      notificationRepository.count.mockResolvedValue(
        8,
      );

      const result =
        await service.getOverview(
          'user-1',
        );

      expect(result).toEqual({
        totalTasks: 10,
        completedTasks: 4,
        pendingTasks: 6,
        totalCategories: 3,
        totalTags: 5,
        totalNotifications: 8,
      });
    });
  });

  describe('getTaskStatusStats', () => {
    it('should return task status statistics', async () => {
      taskRepository.count
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(7)
        .mockResolvedValueOnce(1);

      const result =
        await service.getTaskStatusStats(
          'user-1',
        );

      expect(result).toEqual({
        todo: 5,
        inProgress: 3,
        completed: 7,
        cancelled: 1,
      });
    });
  });

  describe('getTaskPriorityStats', () => {
    it('should return task priority statistics', async () => {
      taskRepository.count
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(1);

      const result =
        await service.getTaskPriorityStats(
          'user-1',
        );

      expect(result).toEqual({
        low: 2,
        medium: 4,
        high: 6,
        urgent: 1,
      });
    });
  });

  describe('getProductivity', () => {
    it('should calculate productivity metrics', async () => {
      taskRepository.count
        .mockResolvedValueOnce(20)
        .mockResolvedValueOnce(10);

      const result =
        await service.getProductivity(
          'user-1',
        );

      expect(result).toEqual({
        totalTasks: 20,
        completedTasks: 10,
        activeTasks: 10,
        completionRate: 50,
      });
    });

    it('should return zero completion rate when no tasks exist', async () => {
      taskRepository.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result =
        await service.getProductivity(
          'user-1',
        );

      expect(result).toEqual({
        totalTasks: 0,
        completedTasks: 0,
        activeTasks: 0,
        completionRate: 0,
      });
    });
  });
});