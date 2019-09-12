import { MappedStore, MetaDataModel } from "@ngxs/store/src/internal/internals";
import { NgxsDataPluginModule } from "../ngxs-data.module";

export function getStateFromFactory(stateMeta: MetaDataModel): MappedStore {
  return NgxsDataPluginModule.stateFactory.states.find(
    state => state.name === stateMeta.name
  );
}
