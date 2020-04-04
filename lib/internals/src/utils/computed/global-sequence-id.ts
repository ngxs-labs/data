import { NgxsDataInjector } from '../../services/ngxs-data-injector.service';

export function globalSequenceId(): number {
    return NgxsDataInjector?.computed?.sequenceValue ?? 0;
}
