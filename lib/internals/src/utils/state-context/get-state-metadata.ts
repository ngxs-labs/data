import { Any } from '@angular-ru/common/typings';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { NGXS_META_KEY } from '@ngxs-labs/data/tokens';
import { DataStateClass } from '@ngxs-labs/data/typings';

export function getStateMetadata(target: DataStateClass): MetaDataModel {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    return (target as Any)?.[NGXS_META_KEY]!;
}
