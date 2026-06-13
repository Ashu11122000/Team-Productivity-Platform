/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TagsService } from '../../../src/tags/services/tags.service';

import { Tag } from '../../../src/tags/entities/tag.entity';

import { ActivityLogsService } from '../../../src/activity-logs/services/activity-logs.service';

describe('TagsService', () => {
  let service: TagsService;

  let repository: jest.Mocked<Repository<Tag>>;

  const activityLogsServiceMock = {
    log: jest.fn(),
  };

  beforeEach(async function (this: void) {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          TagsService,

          {
            provide: getRepositoryToken(Tag),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),
              findAndCount: jest.fn(),
              remove: jest.fn(),
            },
          },

          {
            provide: ActivityLogsService,
            useValue:
              activityLogsServiceMock,
          },
        ],
      }).compile();

    service =
      module.get<TagsService>(
        TagsService,
      );

    repository =
      module.get(
        getRepositoryToken(Tag),
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create tag', async () => {
    const tag = {
      id: '1',
      name: 'Backend',
      userId: 'user-1',
    } as Tag;

    repository.create.mockReturnValue(
      tag,
    );

    repository.save.mockResolvedValue(
      tag,
    );

    const result =
      await service.create(
        {
          name: 'Backend',
        },
        'user-1',
      );

    expect(result).toEqual(
      tag,
    );

    expect(
      activityLogsServiceMock.log,
    ).toHaveBeenCalled();
  });

  it('should find tag', async () => {
    const tag = {
      id: '1',
      name: 'Backend',
    } as Tag;

    repository.findOne.mockResolvedValue(
      tag,
    );

    const result =
      await service.findOne(
        '1',
        'user-1',
      );

    expect(result).toEqual(
      tag,
    );
  });

  it('should update tag', async () => {
    const tag = {
      id: '1',
      name: 'Backend',
      color: '#fff',
    } as Tag;

    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(tag);

    repository.save.mockResolvedValue({
      ...tag,
      name: 'Updated',
    });

    const result =
      await service.update(
        '1',
        {
          name: 'Updated',
        },
        'user-1',
      );

    expect(result.name).toBe(
      'Updated',
    );

    expect(
      activityLogsServiceMock.log,
    ).toHaveBeenCalled();
  });

  it('should remove tag', async () => {
    const tag = {
      id: '1',
      name: 'Backend',
    } as Tag;

    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(tag);

    repository.remove.mockResolvedValue(
      tag,
    );

    await service.remove(
      '1',
      'user-1',
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repository.remove).toHaveBeenCalled();

    expect(
      activityLogsServiceMock.log,
    ).toHaveBeenCalled();
  });
});