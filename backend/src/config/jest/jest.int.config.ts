import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: '../../../',
  verbose: true,

  moduleFileExtensions: ['ts', 'js', 'json'],

  testRegex: '.*\\.int\\.spec\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/config/**',
    '!src/**/*.spec.ts',
    '!src/**/*constants.ts',
    '!src/db/tables/**',
    '!src/db/enums/**',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/validators/**',
  ],
};
export default config;
