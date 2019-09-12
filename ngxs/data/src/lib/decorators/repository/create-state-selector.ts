import { NgxsDataPluginModule } from "../../ngxs-data.module";
import { Any, MetaProperty } from "../../symbols";

export function createStateSelector<T>(
  props: MetaProperty<T>
): PropertyDescriptor {
  return {
    enumerable: true,
    configurable: true,
    get(): Any {
      return NgxsDataPluginModule.store.select(props.stateClass);
    }
  };
}
