import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';

export function silentDeserializeWarning(key: string, value: string | null, error: string): void {
    console.warn(
        `${NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_DESERIALIZE} from metadata { key: '${key}', value: '${value}' }. \nError deserialize: ${error}`
    );
}
