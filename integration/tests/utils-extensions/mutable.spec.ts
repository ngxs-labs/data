import { MutableTypePipe, MutableTypePipeModule } from '@angular-ru/common/pipes';
import { Component, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsModule, State } from '@ngxs/store';

import { Immutable } from '@angular-ru/common/typings';

describe('Mutable', () => {
    interface A {
        a: number;
        b: number;
    }

    it('Immutable<A> to A', () => {
        const a: Immutable<A> = { a: 1, b: 2 };
        const mutableA = new MutableTypePipe().transform(a);

        mutableA.b++;
        expect(a).toEqual({ a: 1, b: 3 });
    });

    it('Immutable<A>[] to A[]', () => {
        const arr: Immutable<A[]> = [
            { a: 1, b: 2 },
            { a: 2, b: 3 }
        ];

        const mutableArr = new MutableTypePipe().transform(arr);

        mutableArr[0]!.a++;
        mutableArr[1]!.b++;

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
        class AppState extends NgxsImmutableDataRepository<number> {}

        @Component({ selector: 'app', template: '{{ appState.state$ | async | mutable }}' })
        class AppComponent {
            constructor(public appState: AppState) {}
        }

        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [NgxsModule.forRoot([AppState]), NgxsDataPluginModule.forRoot(), MutableTypePipeModule]
        }).compileComponents();

        const app = TestBed.createComponent(AppComponent);
        app.autoDetectChanges();

        expect(parseFloat(app.nativeElement.innerHTML)).toEqual(0);
    });
});
