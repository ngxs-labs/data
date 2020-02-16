import { NgxsDataPluginModule, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
import { NgxsModule, State, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('[TEST]: Freeze states', () => {
    it('should be return null from state', () => {
        @StateRepository()
        @State({
            name: 'myState',
            defaults: null
        })
        @Injectable()
        class MyState extends NgxsDataRepository<string> {}

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([MyState]), NgxsDataPluginModule.forRoot()]
        });

        const store: Store = TestBed.get<Store>(Store);
        const state: MyState = TestBed.get<MyState>(MyState);

        expect(store.snapshot()).toEqual({ myState: null });
        expect(state.getState()).toEqual(null);
    });

    it('should be return array from state', () => {
        interface StateModel {
            a?: number;
            b?: number;
        }

        @StateRepository()
        @State<StateModel[]>({
            name: 'myArrState',
            defaults: [{ a: 1 }, { b: 2 }]
        })
        @Injectable()
        class MyArrState extends NgxsDataRepository<StateModel[]> {}

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([MyArrState]), NgxsDataPluginModule.forRoot()]
        });

        const store: Store = TestBed.get<Store>(Store);
        const state: MyArrState = TestBed.get<MyArrState>(MyArrState);

        expect(store.snapshot()).toEqual({ myArrState: [{ a: 1 }, { b: 2 }] });
        expect(state.getState()).toEqual([{ a: 1 }, { b: 2 }]);

        const snapshot: StateModel[] = state.getState() as StateModel[];
        let message: string | null = null;

        try {
            snapshot[0].a!++;
        } catch (e) {
            message = e.message;
        }

        expect(`Cannot assign to read only property 'a' of object '[object Object]'`).toEqual(message);

        try {
            snapshot[0].b = 3;
        } catch (e) {
            message = e.message;
        }

        expect(`Cannot add property b, object is not extensible`).toEqual(message);

        try {
            snapshot[1].b!++;
        } catch (e) {
            message = e.message;
        }

        expect(`Cannot assign to read only property 'b' of object '[object Object]'`).toEqual(message);
    });

    it('should be return date from state', () => {
        interface DateModel {
            date: Date;
        }

        @StateRepository()
        @State<DateModel>({
            name: 'dateState',
            defaults: {
                date: new Date('01.06.1994')
            }
        })
        @Injectable()
        class DateState extends NgxsDataRepository<DateModel> {}

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([DateState]), NgxsDataPluginModule.forRoot()]
        });

        const store: Store = TestBed.get<Store>(Store);
        const state: DateState = TestBed.get<DateState>(DateState);

        expect(store.snapshot()).toEqual({
            dateState: {
                date: new Date('01.06.1994')
            }
        });
        expect(state.getState()).toEqual({
            date: new Date('01.06.1994')
        });

        expect(state.getState().date.getFullYear()).toEqual(1994);
    });
});
