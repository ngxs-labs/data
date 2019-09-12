import { State } from "@ngxs/store";

@State({
  name: "count",
  defaults: { val: 0 }
})
export class CountState {}
