/* istanbul ignore next */
import { NGXS_DATA_META, NGXS_META_KEY } from '@ngxs-labs/data/tokens';
import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';

import { Any } from './any';
import { NgxsRepositoryMeta } from './repository';

export interface DataStateClass<T = Any, U = Any> extends StateClassInternal<T, U> {
    [NGXS_DATA_META]?: NgxsRepositoryMeta;
    [NGXS_META_KEY]?: MetaDataModel;
}

export type StateClassDecorator = (stateClass: DataStateClass) => void;

export type StateArgumentDecorator = (
    stateClass: DataStateClass,
    propertyKey: string | symbol,
    parameterIndex: number
) => void;
