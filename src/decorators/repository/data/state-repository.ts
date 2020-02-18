import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';
import { StateClass } from '@ngxs/store/internals';

import { createRepositoryMetadata } from '../utils/create-repository-metadata';
import { createStateSelector } from '../utils/create-state-selector';
import { Any, NGXS_DATA_EXCEPTIONS } from '../../../interfaces/internal.interface';
import { createContext } from '../utils/create-context';
import { buildDefaultsGraph } from '../../../utils/internals/utils';
import { ensureStateMetadata } from '../../../utils/internals/ensure-state-metadata';

export function StateRepository(): ClassDecorator {
    return <TFunction extends Function>(stateClass: TFunction): TFunction | void => {
        const stateClassInternal: StateClassInternal = (stateClass as Any) as StateClassInternal;
        const stateMeta: MetaDataModel = ensureStateMetadata(stateClassInternal);

        if (!stateMeta.name) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE);
        }

        createRepositoryMetadata(stateClassInternal, stateMeta);
        const cloneDefaults: Any = buildDefaultsGraph(stateClassInternal);

        Object.defineProperties(stateClass.prototype, {
            name: { enumerable: true, configurable: true, value: stateMeta.name },
            initialState: {
                enumerable: true,
                configurable: true,
                get(): Any {
                    return cloneDefaults;
                }
            },
            context: createContext((stateClass as Any) as StateClass)
        });

        createStateSelector((stateClass as Any) as StateClass);
    };
}
