import { deepClone } from '@angular-ru/common/object';
import { Any } from '@angular-ru/common/typings';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import {
    buildDefaultsGraph,
    createContext,
    createRepositoryMetadata,
    createStateSelector,
    ensureStateMetadata
} from '@ngxs-labs/data/internals';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { DataStateClass, StateClassDecorator } from '@ngxs-labs/data/typings';

export function StateRepository(): StateClassDecorator {
    return (stateClass: DataStateClass): void => {
        const stateMeta: MetaDataModel = ensureStateMetadata(stateClass);

        if (!stateMeta.name) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE);
        }

        createRepositoryMetadata(stateClass, stateMeta);
        const cloneDefaults: Any = buildDefaultsGraph(stateClass);

        defineProperties(stateClass, stateMeta, cloneDefaults);
        createStateSelector(stateClass);
    };
}

function defineProperties(stateClass: DataStateClass, stateMeta: MetaDataModel, cloneDefaults: Any): void {
    Object.defineProperties(stateClass.prototype, {
        name: {
            enumerable: true,
            configurable: true,
            value: stateMeta.name
        },
        initialState: {
            enumerable: true,
            configurable: true,
            get(): Any {
                // preserve mutation
                return deepClone(cloneDefaults);
            }
        },
        context: createContext(stateClass)
    });
}
