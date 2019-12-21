import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';
import { ensureStoreMetadata } from '@ngxs/store';

import { createRepositoryMetadata } from '../utils/create-repository-metadata';
import { NGXS_DATA_EXCEPTIONS } from '../../../interfaces/external.interface';
import { createStateSelector } from '../utils/create-state-selector';
import { Any } from '../../../interfaces/internal.interface';
import { createContext } from '../utils/create-context';
import { clone } from '../../../internals/utils';

export function StateRepository(): ClassDecorator {
    return <TFunction extends Function>(stateClass: TFunction): TFunction | void => {
        const stateMeta: MetaDataModel = ensureStoreMetadata((stateClass as Any) as StateClassInternal);

        if (!stateMeta.name) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE);
        }

        createRepositoryMetadata(stateClass, stateMeta);
        const cloneDefaults: Any = clone(stateMeta.defaults);

        Object.defineProperties(stateClass.prototype, {
            name: { enumerable: true, configurable: true, value: stateMeta.name },
            initialState: {
                enumerable: true,
                configurable: true,
                get(): Any {
                    return cloneDefaults;
                }
            },
            context: createContext(stateClass)
        });

        createStateSelector(stateClass);
    };
}
