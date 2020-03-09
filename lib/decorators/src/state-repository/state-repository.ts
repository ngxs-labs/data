import {
    buildDefaultsGraph,
    createContext,
    createRepositoryMetadata,
    createStateSelector,
    ensureStateMetadata
} from '@ngxs-labs/data/internals';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';
import { StateClass } from '@ngxs/store/internals';
import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';

export function StateRepository(): ClassDecorator {
    return <TFunction extends Function>(stateClass: TFunction): TFunction | void => {
        const stateClassInternal: StateClassInternal = (stateClass as Any) as StateClassInternal;
        const stateMeta: MetaDataModel = ensureStateMetadata(stateClassInternal);

        if (!stateMeta.name) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE);
        }

        createRepositoryMetadata(stateClassInternal, stateMeta);
        const cloneDefaults: Any = buildDefaultsGraph(stateClassInternal);

        defineProperties(stateClass, stateMeta, cloneDefaults);
        createStateSelector((stateClass as Any) as StateClass);
    };
}

function defineProperties(stateClass: Function, stateMeta: MetaDataModel, cloneDefaults: Any): void {
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
}
