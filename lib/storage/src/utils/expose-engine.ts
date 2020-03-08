import {
    Any,
    DataStorage,
    ExistingEngineProvider,
    ExistingStorageEngine,
    PersistenceProvider,
    UseClassEngineProvider
} from '@ngxs-labs/data/typings';

import { NotDeclareEngineException } from '../exceptions/not-declare-engine.exception';
import { NotImplementedStorageException } from '../exceptions/not-implemented-storage.exception';
// noinspection TypeScriptPreferShortImport, preserve circular dependencies
import { NgxsDataStoragePlugin } from '../ngxs-data-storage-plugin.service';
import { ensureKey } from './ensure-key';

export function exposeEngine(provider: PersistenceProvider): ExistingStorageEngine {
    const engine: ExistingStorageEngine | null | undefined =
        (provider as ExistingEngineProvider).existingEngine ||
        NgxsDataStoragePlugin.injector!.get<DataStorage>((provider as UseClassEngineProvider).useClass as Any, null!);

    if (!engine) {
        throw new NotDeclareEngineException(ensureKey(provider));
    } else if (!('getItem' in engine)) {
        throw new NotImplementedStorageException();
    }

    return engine;
}
