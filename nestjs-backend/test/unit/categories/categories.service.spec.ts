/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CategoriesService } from '../../../src/categories/services/categories.service';
import { Category } from '../../../src/categories/entities/category.entity';

import { ActivityLogsService } from '../../../src/activity-logs/services/activity-logs.service';
import { NotificationsService } from '../../../src/notifications/services/notifications.service';

describe('CategoriesService', () => {
let service: CategoriesService;

let repository: {
create: jest.Mock;
save: jest.Mock;
findOne: jest.Mock;
findAndCount: jest.Mock;
remove: jest.Mock;
};

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
CategoriesService,

      {
        provide: getRepositoryToken(Category),
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
        useValue: activityLogsServiceMock,
      },

      {
        provide: NotificationsService,
        useValue: notificationsServiceMock,
      },
    ],
  }).compile();

service =
  module.get<CategoriesService>(
    CategoriesService,
  );

repository =
  module.get(
    getRepositoryToken(Category),
  );

});

afterEach(() => {
jest.clearAllMocks();
});

it('should be defined', () => {
expect(service).toBeDefined();
});

it('should create category', async () => {
const category = {
id: '1',
name: 'Work',
userId: 'user-1',
} as Category;

repository.create.mockReturnValue(
  category,
);

repository.save.mockResolvedValue(
  category,
);

const result = await service.create(
  {
    name: 'Work',
  },
  'user-1',
);

expect(result).toEqual(
  category,
);

expect(
  repository.save,
).toHaveBeenCalled();

expect(
  activityLogsServiceMock.log,
).toHaveBeenCalled();

});

it('should find category', async () => {
const category = {
id: '1',
name: 'Work',
} as Category;

repository.findOne.mockResolvedValue(
  category,
);

const result = await service.findOne(
  '1',
  'user-1',
);

expect(result).toEqual(
  category,
);


});

it('should update category', async () => {
const category = {
id: '1',
name: 'Work',
color: '#fff',
} as Category;

jest
  .spyOn(
    service,
    'findOne',
  )
  .mockResolvedValue(
    category,
  );

repository.save.mockResolvedValue({
  ...category,
  name: 'Updated',
});

const result = await service.update(
  '1',
  {
    name: 'Updated',
  },
  'user-1',
);

expect(
  result.name,
).toBe(
  'Updated',
);

expect(
  repository.save,
).toHaveBeenCalled();

expect(
  notificationsServiceMock.create,
).toHaveBeenCalled();

expect(
  activityLogsServiceMock.log,
).toHaveBeenCalled();

});

it('should remove category', async () => {
const category = {
id: '1',
name: 'Work',
} as Category;

jest
  .spyOn(
    service,
    'findOne',
  )
  .mockResolvedValue(
    category,
  );

repository.remove.mockResolvedValue(
  category,
);

await service.remove(
  '1',
  'user-1',
);

expect(
  repository.remove,
).toHaveBeenCalled();

expect(
  activityLogsServiceMock.log,
).toHaveBeenCalled();

});
});
