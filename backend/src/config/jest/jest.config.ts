import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../../../',
  verbose: true,
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/config/**',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/*constants.ts',
    '!src/db/tables/**',
    '!src/db/enums/**',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/validators/**',
    '!src/main.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.type.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  extensionsToTreatAsEsm: [],
  clearMocks: true,
  restoreMocks: true,
  maxWorkers: '50%',
  workerIdleMemoryLimit: '512MB',
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
};

export default config;
