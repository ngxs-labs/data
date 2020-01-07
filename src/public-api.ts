/*
 * Public API Surface of data
 */
export * from './lib/ngxs-data.module';

/**
 * @Repositories
 */
export { NgxsDataRepository } from './lib/repositories/ngxs-data.repository';

/**
 * @Pipes
 */
export { NgxsDataMutablePipe } from './lib/pipes/ngxs-data-mutable.pipe';

/**
 * @Decorators
 */
export * from './lib/decorators/persistence/persistence';
export * from './lib/decorators/repository/data/state-repository';
export * from './lib/decorators/action/action';

// TODO: Deprecated
export * from './lib/decorators/query/query';

/**
 * @Interfaces
 */
export * from './lib/interfaces/external.interface';

// TODO: Deprecated
export { NGXS_DATA_EXCEPTIONS } from './lib/interfaces/internal.interface';

// TODO: Deprecated
export { NGXS_DATA_META } from './lib/interfaces/internal.interface';
