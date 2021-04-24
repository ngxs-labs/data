const { createTsJestConfig } = require('@angular-ru/jest-utils');

module.exports = createTsJestConfig({
    tsConfig: './tsconfig.json',
    isolatedModules: false,
    jestConfig: {
        rootDir: '.',
        displayName: '@ngxs-labs/data',
        modulePathIgnorePatterns: ['<rootDir>/dist/'],
        collectCoverageFrom: ['<rootDir>/lib/**/*.ts'],
        testMatch: ['<rootDir>/integration/tests/**/*.spec.ts'],
        setupFilesAfterEnv: ['<rootDir>/integration/tests/setupJest.ts']
    }
});
