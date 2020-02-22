import { Component, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
import { Immutable } from '@ngxs-labs/data/common';
import { NgxsDataUtilsModule } from '@ngxs-labs/data/utils';
import { NgxsModule, State } from '@ngxs/store';

import { NgxsDataMutablePipe } from '../src/utils/external/modules/pipes/ngxs-data-mutable.pipe';

describe('Mutable', () => {
    interface A {
        a: number;
        b: number;
    }

    it('Immutable<A> to A', () => {
        const a: Immutable<A> = { a: 1, b: 2 };
        const mutableA = new NgxsDataMutablePipe().transform(a);

        mutableA.b++;
        expect(a).toEqual({ a: 1, b: 3 });
    });

    it('Immutable<A>[] to A[]', () => {
        const arr: Immutable<A[]> = [
            { a: 1, b: 2 },
            { a: 2, b: 3 }
        ];

        const mutableArr = new NgxsDataMutablePipe().transform(arr);

        mutableArr[0].a++;
        mutableArr[1].b++;

        expect(mutableArr).toEqual([
            { a: 2, b: 2 },
            { a: 2, b: 4 }
        ]);

        expect(mutableArr.reverse()).toEqual([
            { a: 2, b: 4 },
            { a: 2, b: 2 }
        ]);
    });

    it('should be correct work pipe in template', () => {
        @StateRepository()
        @State({ name: 'app', defaults: 0 })
        @Injectable()
        class AppState extends NgxsDataRepository<number> {}

        @Component({ selector: 'app', template: '{{ appState.state$ | async | mutable }}' })
        class AppComponent {
            constructor(public appState: AppState) {}
        }

        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [NgxsModule.forRoot([AppState]), NgxsDataPluginModule.forRoot(), NgxsDataUtilsModule]
        }).compileComponents();

        const app = TestBed.createComponent(AppComponent);
        app.autoDetectChanges();

        expect(parseFloat(app.nativeElement.innerHTML)).toEqual(0);
    });
});
