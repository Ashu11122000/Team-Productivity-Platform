/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';

import { NotificationsController } from '../../src/notifications/controllers/notifications.controller';
import { NotificationsService } from '../../src/notifications/services/notifications.service';

describe(
  'Notifications Integration',
  () => {
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
              provide:
                NotificationsService,

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

    it(
      'should create testing module',
      () => {
        expect(
          controller,
        ).toBeDefined();
      },
    );

    it(
      'should call service findAll',
      async () => {
        notificationsServiceMock.findAll.mockResolvedValue(
          {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          },
        );

        const result =
          await controller.findAll(
            {},
            {
              sub: 'user-1',
            } as never,
          );

        expect(
          notificationsServiceMock.findAll,
        ).toHaveBeenCalled();

        expect(
          result.total,
        ).toBe(0);
      },
    );
  },
);