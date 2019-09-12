import { Any } from "../symbols";

export function clone(value: Any): Any {
  return JSON.parse(JSON.stringify(value));
}
