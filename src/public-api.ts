/*
 * Public API Surface of data
 */

/**
 * @Modules
 */
export * from './lib/ngxs-data.module';
export * from './lib/modules/ngxs-data-utils/ngxs-data-utils.module';

/**
 * @Repositories
 */
export { NgxsDataRepository } from './lib/repositories/ngxs-data.repository';

/**
 * @Decorators
 */
export * from './lib/decorators/persistence/persistence';
export * from './lib/decorators/repository/data/state-repository';
export * from './lib/decorators/action/action';

/**
 * @Interfaces
 */
export * from './lib/interfaces/external.interface';
