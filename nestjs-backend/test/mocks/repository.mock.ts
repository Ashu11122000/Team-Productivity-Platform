export const createRepositoryMock = () => ({
  create: jest.fn(),

  save: jest.fn(),

  find: jest.fn(),

  findOne: jest.fn(),

  findAndCount: jest.fn(),

  count: jest.fn(),

  update: jest.fn(),

  remove: jest.fn(),
});
