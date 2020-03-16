export interface CountModel {
    val: number;
}

export interface ParentCountModel {
    val: number;
    countSub?: CountModel;
}
