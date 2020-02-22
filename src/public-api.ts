/*
 * Public API Surface of data
 */

/**
 * @Modules
 */
export * from './ngxs-data.module';

/**
 * @Repositories
 */
export { NgxsDataRepository } from './repositories/ngxs-data.repository';

/**
 * @Decorators
 */
export * from './decorators/persistence/persistence';
export * from './decorators/repository/data/state-repository';
export * from './decorators/action/action';

/**
 * @Interfaces
 */
export * from './interfaces/external.interface';
export { ActionEvent } from './common/types/action-event';
