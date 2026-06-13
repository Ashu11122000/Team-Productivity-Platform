import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',

  testEnvironment: 'node',

  moduleFileExtensions: ['js', 'json', 'ts'],

  testMatch: ['<rootDir>/test/**/*.spec.ts'],

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!src/**/*.module.ts'],

  coverageDirectory: 'coverage',

  clearMocks: true,

  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};

export default config;
