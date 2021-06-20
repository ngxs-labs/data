import { Any } from '@angular-ru/common/typings';
import { isFalsy } from '@angular-ru/common/utils';
import { MetaDataModel, RuntimeSelectorContext } from '@ngxs/store/src/internal/internals';
import { NGXS_META_KEY } from '@ngxs-labs/data/tokens';
import { DataStateClass } from '@ngxs-labs/data/typings';

import { getStateMetadata } from './get-state-metadata';

export function ensureStateMetadata(target: DataStateClass): MetaDataModel {
    if (isFalsy(target.hasOwnProperty(NGXS_META_KEY))) {
        const defaultMetadata: MetaDataModel = {
            name: null,
            actions: {},
            defaults: {},
            path: null,
            makeRootSelector(context: RuntimeSelectorContext): Any {
                return context.getStateGetter(defaultMetadata.name);
            },
            children: []
        };

        Object.defineProperty(target, NGXS_META_KEY, { value: defaultMetadata });
    }

    return getStateMetadata(target);
}
