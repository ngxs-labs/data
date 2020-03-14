import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { ActionName, PayloadMap, PayloadName } from '@ngxs-labs/data/typings';

export class PayloadRegistry {
    private actionsPayloadMap: Map<ActionName, PayloadMap> = new Map();

    public create(actionName: ActionName, name: PayloadName, paramIndex: number): void {
        let payloadMap: PayloadMap | undefined = this.actionsPayloadMap.get(actionName);

        if (!payloadMap) {
            payloadMap = new Map();
            this.actionsPayloadMap.set(actionName, payloadMap);
        }

        if (payloadMap.has(name)) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_PAYLOAD_KEY_EXIST);
        } else {
            payloadMap.set(name, paramIndex);
        }
    }
}
