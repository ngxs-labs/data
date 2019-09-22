import { Any } from '../interfaces/internal.interface';

export function clone(value: Any): Any {
  return JSON.parse(JSON.stringify(value));
}
