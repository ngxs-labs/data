const path = require('path');
const { pathsToModuleNameMapper: resolver } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

const moduleNameMapper = resolver(compilerOptions.paths, { prefix: '<rootDir>/' });

module.exports = {
    verbose: true,
    watch: false,
    cache: false,
    maxWorkers: 1,
    maxConcurrency: 1,
    preset: 'jest-preset-angular',
    rootDir: path.resolve('.'),
    testMatch: ['<rootDir>/**/*.spec.ts'],
    collectCoverageFrom: ['<rootDir>/lib/**/*.ts'],
    setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
    coverageReporters: ['json', 'lcovonly', 'lcov', 'text', 'html'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.json',
            allowSyntheticDefaultImports: true
        }
    },
    bail: true,
    moduleNameMapper,
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    modulePaths: ['<rootDir>']
};
