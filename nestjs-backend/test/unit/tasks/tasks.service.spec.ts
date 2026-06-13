/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TasksService } from '../../../src/tasks/services/task.service';

import { Task } from '../../../src/tasks/entities/task.entity';
import { Tag } from '../../../src/tags/entities/tag.entity';

import { ActivityLogsService } from '../../../src/activity-logs/services/activity-logs.service';
import { NotificationsService } from '../../../src/notifications/services/notifications.service';

import { TaskStatus } from '../../../src/common/enums/task-status.enum';
import { TaskPriority } from '../../../src/common/enums/task-priority.enum';

describe('TasksService', () => {
  let service: TasksService;

  let taskRepository: jest.Mocked<Repository<Task>>;

  const activityLogsServiceMock = {
    log: jest.fn(),
  };

  const notificationsServiceMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          TasksService,

          {
            provide: getRepositoryToken(Task),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),
              findAndCount: jest.fn(),
              remove: jest.fn(),
            },
          },

          {
            provide: getRepositoryToken(Tag),
            useValue: {
              find: jest.fn(),
            },
          },

          {
            provide: ActivityLogsService,
            useValue:
              activityLogsServiceMock,
          },

          {
            provide: NotificationsService,
            useValue:
              notificationsServiceMock,
          },
        ],
      }).compile();

    service =
      module.get<TasksService>(
        TasksService,
      );

    taskRepository =
      module.get(
        getRepositoryToken(Task),
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create task', async () => {
      const task = {
        id: '1',
        title: 'Task',
        userId: 'user-1',
      } as Task;

      taskRepository.create.mockReturnValue(
        task,
      );

      taskRepository.save.mockResolvedValue(
        task,
      );

      const result =
        await service.create(
          {
            title: 'Task',
          },
          'user-1',
        );

      expect(result).toEqual(task);

     expect(result).toEqual(task);

// eslint-disable-next-line @typescript-eslint/unbound-method
expect(taskRepository.save).toHaveBeenCalled();

expect(
  activityLogsServiceMock.log,
).toHaveBeenCalled();

      expect(
        activityLogsServiceMock.log,
      ).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return task', async () => {
      const task = {
        id: '1',
        title: 'Task',
      } as Task;

      taskRepository.findOne.mockResolvedValue(
        task,
      );

      const result =
        await service.findOne(
          '1',
          'user-1',
        );

      expect(result).toEqual(task);
    });
  });

  describe('update', () => {
    it('should update task', async () => {
      const task = {
        id: '1',
        title: 'Task',
        status:
          TaskStatus.TODO,

        priority:
          TaskPriority.MEDIUM,

        tags: [],
        userId: 'user-1',

        isConvertedFromNote:
          false,

        createdAt:
          new Date(),

        updatedAt:
          new Date(),
      } as Task;

      jest
        .spyOn(
          service,
          'findOne',
        )
        .mockResolvedValue(task);

      taskRepository.save.mockResolvedValue({
        ...task,
        status:
          TaskStatus.COMPLETED,
      });

      const result =
        await service.update(
          '1',
          {
            status:
              TaskStatus.COMPLETED,
          },
          'user-1',
        );

      expect(
        result.status,
      ).toBe(
        TaskStatus.COMPLETED,
      );

      expect(
        notificationsServiceMock.create,
      ).toHaveBeenCalled();

      expect(
        activityLogsServiceMock.log,
      ).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove task', async () => {
      const task = {
        id: '1',
        title: 'Task',

        status:
          TaskStatus.TODO,

        priority:
          TaskPriority.MEDIUM,
      } as Task;

      jest
        .spyOn(
          service,
          'findOne',
        )
        .mockResolvedValue(task);

      taskRepository.remove.mockResolvedValue(
        task,
      );

      await service.remove(
        '1',
        'user-1',
      );

    await service.remove(
  '1',
  'user-1',
);

// eslint-disable-next-line @typescript-eslint/unbound-method
expect(taskRepository.remove).toHaveBeenCalled();

expect(
  activityLogsServiceMock.log,
).toHaveBeenCalled();

      expect(
        activityLogsServiceMock.log,
      ).toHaveBeenCalled();
    });
  });

  describe('convertNoteToTask', () => {
    it('should convert note into task', async () => {
      const task = {
        id: '1',
        title: 'Converted',
      } as Task;

      taskRepository.create.mockReturnValue(
        task,
      );

      taskRepository.save.mockResolvedValue(
        task,
      );

      const result =
        await service.convertNoteToTask(
          'note-1',
          'Converted',
          'Description',
          'user-1',
        );

      expect(result).toEqual(task);

      expect(
        activityLogsServiceMock.log,
      ).toHaveBeenCalled();
    });
  });
});