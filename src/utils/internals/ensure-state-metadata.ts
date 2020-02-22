import { MetaDataModel, RuntimeSelectorContext, StateClassInternal } from '@ngxs/store/src/internal/internals';

import { getStateMetadata } from './get-state-metadata';
import { META_KEY } from './meta-key';

export function ensureStateMetadata(target: StateClassInternal): MetaDataModel {
    if (!target.hasOwnProperty(META_KEY)) {
        const defaultMetadata: MetaDataModel = {
            name: null,
            actions: {},
            defaults: {},
            path: null,
            makeRootSelector(context: RuntimeSelectorContext) {
                return context.getStateGetter(defaultMetadata.name);
            },
            children: []
        };

        Object.defineProperty(target, META_KEY, { value: defaultMetadata });
    }
    return getStateMetadata(target);
}
