import { Injector } from '@angular/core';
import { Any } from '@angular-ru/common/typings';
import { isNil } from '@angular-ru/common/utils';
import {
    DataStorage,
    ExistingEngineProvider,
    ExistingStorageEngine,
    PersistenceProvider,
    UseClassEngineProvider
} from '@ngxs-labs/data/typings';

import { NotDeclareEngineException } from '../exceptions/not-declare-engine.exception';
import { NotImplementedStorageException } from '../exceptions/not-implemented-storage.exception';
import { ensureKey } from './ensure-key';

export function exposeEngine(provider: PersistenceProvider, injector: Injector): ExistingStorageEngine {
    const engine: ExistingStorageEngine | null | undefined =
        (provider as ExistingEngineProvider).existingEngine ??
        injector.get<DataStorage>((provider as UseClassEngineProvider).useClass as Any, null!);

    if (isNil(engine)) {
        throw new NotDeclareEngineException(ensureKey(provider));
    } else if (!('getItem' in engine)) {
        throw new NotImplementedStorageException();
    }

    return engine;
}
