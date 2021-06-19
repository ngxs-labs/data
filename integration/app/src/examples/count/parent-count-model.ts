import { CountModel } from './count-model';

export interface ParentCountModel {
    val: number;
    countSub?: CountModel;
}
