/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { NotificationsService } from '../../../src/notifications/services/notifications.service';
import { Notification } from '../../../src/notifications/entities/notification.entity';

import { NotificationStatus } from '../../../src/common/enums/notification-status.enum';
import { NotificationType } from '../../../src/common/enums/notification-type.enum';

import { createRepositoryMock } from '../../mocks/repository.mock';

describe('NotificationsService', () => {
let service: NotificationsService;

let repository: {
create: jest.Mock;
save: jest.Mock;
findOne: jest.Mock;
findAndCount: jest.Mock;
update: jest.Mock;
remove: jest.Mock;
};

beforeEach(async () => {
const module: TestingModule =
await Test.createTestingModule({
providers: [
NotificationsService,
{
provide:
getRepositoryToken(
Notification,
),
useValue:
createRepositoryMock(),
},
],
}).compile();

service =
  module.get<NotificationsService>(
    NotificationsService,
  );

repository =
  module.get(
    getRepositoryToken(
      Notification,
    ),
  );

});

afterEach(() => {
jest.clearAllMocks();
});

it('should be defined', () => {
expect(service).toBeDefined();
});

it('should create notification', async () => {
const notification = {
id: '1',
title: 'Task Completed',
message: 'Completed',
type:
NotificationType.TASK_COMPLETED,
status:
NotificationStatus.UNREAD,
userId: 'user-1',
} as Notification;

repository.create.mockReturnValue(
  notification,
);

repository.save.mockResolvedValue(
  notification,
);

const result =
  await service.create({
    title:
      'Task Completed',

    message:
      'Completed',

    type:
      NotificationType.TASK_COMPLETED,

    userId:
      'user-1',
  });

expect(result).toEqual(
  notification,
);

expect(
  repository.save,
).toHaveBeenCalled();

});

it('should find notification by id', async () => {
const notification = {
id: '1',
userId: 'user-1',
} as Notification;

repository.findOne.mockResolvedValue(
  notification,
);

const result =
  await service.findOne(
    '1',
    'user-1',
  );

expect(result).toEqual(
  notification,
);

});

it('should mark notification as read', async () => {
const notification = {
id: '1',
userId: 'user-1',
status:
NotificationStatus.UNREAD,
} as Notification;

repository.findOne.mockResolvedValue(
  notification,
);

repository.save.mockResolvedValue({
  ...notification,
  status:
    NotificationStatus.READ,
});

const result =
  await service.markAsRead(
    '1',
    'user-1',
  );

expect(
  result.status,
).toBe(
  NotificationStatus.READ,
);

expect(
  repository.save,
).toHaveBeenCalled();

});
});
