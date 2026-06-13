/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';

import { NotificationsController } from '../../../src/notifications/controllers/notifications.controller';
import { NotificationsService } from '../../../src/notifications/services/notifications.service';

import { NotificationStatus } from '../../../src/common/enums/notification-status.enum';
import { NotificationType } from '../../../src/common/enums/notification-type.enum';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const notificationsServiceMock = {
    findAll: jest.fn(),

    findOne: jest.fn(),

    markAsRead: jest.fn(),

    markAllAsRead: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          NotificationsController,
        ],

        providers: [
          {
            provide: NotificationsService,
            useValue:
              notificationsServiceMock,
          },
        ],
      }).compile();

    controller =
      module.get<NotificationsController>(
        NotificationsController,
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return notifications', async () => {
    const result = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    notificationsServiceMock.findAll.mockResolvedValue(
      result,
    );

    await expect(
      controller.findAll(
        {},
        {
          sub: 'user-1',
        } as never,
      ),
    ).resolves.toEqual(result);
  });

  it('should return one notification', async () => {
    const notification = {
      id: '1',
      title: 'Task Completed',

      status:
        NotificationStatus.UNREAD,

      type:
        NotificationType.TASK_COMPLETED,
    };

    notificationsServiceMock.findOne.mockResolvedValue(
      notification,
    );

    await expect(
      controller.findOne(
        '1',
        {
          sub: 'user-1',
        } as never,
      ),
    ).resolves.toEqual(
      notification,
    );
  });

  it('should mark notification as read', async () => {
    const notification = {
      id: '1',

      status:
        NotificationStatus.READ,
    };

    notificationsServiceMock.markAsRead.mockResolvedValue(
      notification,
    );

    await expect(
      controller.markAsRead(
        '1',
        {
          sub: 'user-1',
        } as never,
      ),
    ).resolves.toEqual(
      notification,
    );
  });

  it('should mark all notifications as read', async () => {
    const response = {
      updated: 5,
    };

    notificationsServiceMock.markAllAsRead.mockResolvedValue(
      response,
    );

    await expect(
      controller.markAllAsRead({
        sub: 'user-1',
      } as never),
    ).resolves.toEqual(
      response,
    );
  });
});