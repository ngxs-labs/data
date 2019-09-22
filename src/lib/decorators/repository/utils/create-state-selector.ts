import { NgxsDataAccessor } from '../../../services/data-access-injector.service';
import { Any } from '../../../interfaces/internal.interface';

export function createStateSelector<T>(stateClass: Function): PropertyDescriptor {
  return {
    enumerable: true,
    configurable: true,
    get(): Any {
      return NgxsDataAccessor.store.select(stateClass as Any);
    }
  };
}
