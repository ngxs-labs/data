const { createTsJestConfig } = require('@angular-ru/jest-utils');
const path = require('path');

module.exports = createTsJestConfig({
    maxWorkers: 2,
    maxConcurrency: 2,
    displayName: '@ngxs-labs/data',
    rootDir: path.resolve('.'),
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    collectCoverageFrom: ['<rootDir>/lib/**/*.ts'],
    testMatch: ['<rootDir>/integration/tests/**/*.spec.ts'],
    setupFilesAfterEnv: ['<rootDir>/integration/tests/setupJest.ts'],
    tsConfigRootPath: path.resolve('./tsconfig.json')
});
