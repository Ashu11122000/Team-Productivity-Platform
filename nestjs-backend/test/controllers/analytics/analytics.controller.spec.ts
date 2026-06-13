/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';

import { AnalyticsController } from '../../../src/analytics/controllers/analytics.controller';
import { AnalyticsService } from '../../../src/analytics/services/analytics.service';

import { Role } from '../../../src/common/enums/roles.enum';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;

  const analyticsServiceMock = {
    getOverview: jest.fn(),

    getTaskStatusStats: jest.fn(),

    getTaskPriorityStats: jest.fn(),

    getProductivity: jest.fn(),
  };

  const user = {
    sub: 'user-1',
    email: 'user@example.com',
    role: Role.USER,
    iss: 'fastapi-backend',
    aud: 'team-productivity-platform',
    type: 'access',
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          AnalyticsController,
        ],

        providers: [
          {
            provide: AnalyticsService,
            useValue:
              analyticsServiceMock,
          },
        ],
      }).compile();

    controller =
      module.get<AnalyticsController>(
        AnalyticsController,
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOverview', () => {
    it('should return analytics overview', async () => {
      const response = {
        totalTasks: 10,
        completedTasks: 4,
        pendingTasks: 6,
        totalCategories: 3,
        totalTags: 5,
        totalNotifications: 8,
      };

      analyticsServiceMock.getOverview.mockResolvedValue(
        response,
      );

      const result =
        await controller.getOverview(
          user,
        );

      expect(
        analyticsServiceMock.getOverview,
      ).toHaveBeenCalledWith(
        'user-1',
      );

      expect(result).toEqual(
        response,
      );
    });
  });

  describe('getTaskStatusStats', () => {
    it('should return task status statistics', async () => {
      const response = {
        todo: 5,
        inProgress: 3,
        completed: 7,
        cancelled: 1,
      };

      analyticsServiceMock.getTaskStatusStats.mockResolvedValue(
        response,
      );

      const result =
        await controller.getTaskStatusStats(
          user,
        );

      expect(
        analyticsServiceMock.getTaskStatusStats,
      ).toHaveBeenCalledWith(
        'user-1',
      );

      expect(result).toEqual(
        response,
      );
    });
  });

  describe('getTaskPriorityStats', () => {
    it('should return task priority statistics', async () => {
      const response = {
        low: 2,
        medium: 4,
        high: 6,
        urgent: 1,
      };

      analyticsServiceMock.getTaskPriorityStats.mockResolvedValue(
        response,
      );

      const result =
        await controller.getTaskPriorityStats(
          user,
        );

      expect(
        analyticsServiceMock.getTaskPriorityStats,
      ).toHaveBeenCalledWith(
        'user-1',
      );

      expect(result).toEqual(
        response,
      );
    });
  });

  describe('getProductivity', () => {
    it('should return productivity metrics', async () => {
      const response = {
        totalTasks: 20,
        completedTasks: 10,
        activeTasks: 10,
        completionRate: 50,
      };

      analyticsServiceMock.getProductivity.mockResolvedValue(
        response,
      );

      const result =
        await controller.getProductivity(
          user,
        );

      expect(
        analyticsServiceMock.getProductivity,
      ).toHaveBeenCalledWith(
        'user-1',
      );

      expect(result).toEqual(
        response,
      );
    });
  });
});