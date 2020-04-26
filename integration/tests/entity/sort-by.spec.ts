import { StateRepository } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { createEntityCollections } from '@ngxs-labs/data/utils';
import { Injectable } from '@angular/core';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { ngxsTestingPlatform } from '@ngxs-labs/data/testing';
import { Any, EntitySortByOrder } from '@ngxs-labs/data/typings';

describe('Sort by entities', () => {
    let spy: jest.MockInstance<Any, Any>;

    interface People {
        id: number;
        name: string;
        age: number;
    }

    const defaults = createEntityCollections<People>({
        ids: [1, 2, 3, 4, 5],
        entities: {
            1: { id: 1, name: 'Max', age: 25 },
            2: { id: 2, name: 'Ivan', age: 15 },
            3: { id: 3, name: 'Roger', age: 35 },
            4: { id: 4, name: 'Petr', age: 40 },
            5: { id: 5, name: 'Anton', age: 12 }
        }
    });

    @StateRepository()
    @State({ name: 'people', defaults })
    @Injectable()
    class PeopleEntitiesState extends NgxsDataEntityCollectionsRepository<People> {}

    it(
        'invalid comparator',
        ngxsTestingPlatform([PeopleEntitiesState], (_, people) => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            expect(people.getState()).toEqual({
                ids: [1, 2, 3, 4, 5],
                entities: {
                    '1': { id: 1, name: 'Max', age: 25 },
                    '2': { id: 2, name: 'Ivan', age: 15 },
                    '3': { id: 3, name: 'Roger', age: 35 },
                    '4': { id: 4, name: 'Petr', age: 40 },
                    '5': { id: 5, name: 'Anton', age: 12 }
                }
            });

            people.sort();
            expect(spy).toHaveBeenCalledTimes(1);

            expect(console.warn).toHaveBeenLastCalledWith('You must set the compare function before sorting.');

            expect(people.getState()).toEqual({
                ids: [1, 2, 3, 4, 5],
                entities: {
                    '1': { id: 1, name: 'Max', age: 25 },
                    '2': { id: 2, name: 'Ivan', age: 15 },
                    '3': { id: 3, name: 'Roger', age: 35 },
                    '4': { id: 4, name: 'Petr', age: 40 },
                    '5': { id: 5, name: 'Anton', age: 12 }
                }
            });
        })
    );

    it(
        'sort by desc, by asc',
        ngxsTestingPlatform([PeopleEntitiesState], (_, people) => {
            expect(people.getState()).toEqual({
                ids: [1, 2, 3, 4, 5],
                entities: {
                    '1': { id: 1, name: 'Max', age: 25 },
                    '2': { id: 2, name: 'Ivan', age: 15 },
                    '3': { id: 3, name: 'Roger', age: 35 },
                    '4': { id: 4, name: 'Petr', age: 40 },
                    '5': { id: 5, name: 'Anton', age: 12 }
                }
            });

            people
                .setComparator({
                    sortBy: 'age',
                    sortByOrder: EntitySortByOrder.ASC
                })
                .sort();

            expect(people.getState()).toEqual({
                ids: [5, 2, 1, 3, 4],
                entities: {
                    '1': { id: 1, name: 'Max', age: 25 },
                    '2': { id: 2, name: 'Ivan', age: 15 },
                    '3': { id: 3, name: 'Roger', age: 35 },
                    '4': { id: 4, name: 'Petr', age: 40 },
                    '5': { id: 5, name: 'Anton', age: 12 }
                }
            });

            expect(people.selectAll()).toEqual([
                { id: 5, name: 'Anton', age: 12 },
                { id: 2, name: 'Ivan', age: 15 },
                { id: 1, name: 'Max', age: 25 },
                { id: 3, name: 'Roger', age: 35 },
                { id: 4, name: 'Petr', age: 40 }
            ]);

            people.sort({
                sortBy: 'age',
                sortByOrder: EntitySortByOrder.DESC
            });

            expect(people.getState()).toEqual({
                ids: [4, 3, 1, 2, 5],
                entities: {
                    '1': { id: 1, name: 'Max', age: 25 },
                    '2': { id: 2, name: 'Ivan', age: 15 },
                    '3': { id: 3, name: 'Roger', age: 35 },
                    '4': { id: 4, name: 'Petr', age: 40 },
                    '5': { id: 5, name: 'Anton', age: 12 }
                }
            });

            expect(people.selectAll()).toEqual([
                { id: 4, name: 'Petr', age: 40 },
                { id: 3, name: 'Roger', age: 35 },
                { id: 1, name: 'Max', age: 25 },
                { id: 2, name: 'Ivan', age: 15 },
                { id: 5, name: 'Anton', age: 12 }
            ]);

            people.addOne({ id: 6, name: 'Georg', age: 70 });
            people.addOne({ id: 7, name: 'Leon', age: 11 });
            people.addOne({ id: 8, name: 'Mark', age: 18 });

            expect(people.selectAll()).toEqual([
                { id: 6, name: 'Georg', age: 70 },
                { id: 4, name: 'Petr', age: 40 },
                { id: 3, name: 'Roger', age: 35 },
                { id: 1, name: 'Max', age: 25 },
                { id: 8, name: 'Mark', age: 18 },
                { id: 2, name: 'Ivan', age: 15 },
                { id: 5, name: 'Anton', age: 12 },
                { id: 7, name: 'Leon', age: 11 }
            ]);

            people.upsertMany([
                { id: 8, name: 'Mark', age: 38 },
                { id: 3, name: 'Roger', age: 5 },
                { id: 9, name: 'Nikita', age: 90 }
            ]);

            expect(people.selectAll()).toEqual([
                { id: 9, name: 'Nikita', age: 90 },
                { id: 6, name: 'Georg', age: 70 },
                { id: 4, name: 'Petr', age: 40 },
                { id: 8, name: 'Mark', age: 38 },
                { id: 1, name: 'Max', age: 25 },
                { id: 2, name: 'Ivan', age: 15 },
                { id: 5, name: 'Anton', age: 12 },
                { id: 7, name: 'Leon', age: 11 },
                { id: 3, name: 'Roger', age: 5 }
            ]);
        })
    );

    it(
        'sort by compare function',
        ngxsTestingPlatform([PeopleEntitiesState], (_, people) => {
            expect(people.getState()).toEqual({
                ids: [1, 2, 3, 4, 5],
                entities: {
                    '1': { id: 1, name: 'Max', age: 25 },
                    '2': { id: 2, name: 'Ivan', age: 15 },
                    '3': { id: 3, name: 'Roger', age: 35 },
                    '4': { id: 4, name: 'Petr', age: 40 },
                    '5': { id: 5, name: 'Anton', age: 12 }
                }
            });

            people.sort((a, b) => a.age - b.age);

            expect(people.getState()).toEqual({
                ids: [5, 2, 1, 3, 4],
                entities: {
                    '1': { id: 1, name: 'Max', age: 25 },
                    '2': { id: 2, name: 'Ivan', age: 15 },
                    '3': { id: 3, name: 'Roger', age: 35 },
                    '4': { id: 4, name: 'Petr', age: 40 },
                    '5': { id: 5, name: 'Anton', age: 12 }
                }
            });

            expect(people.selectAll()).toEqual([
                { id: 5, name: 'Anton', age: 12 },
                { id: 2, name: 'Ivan', age: 15 },
                { id: 1, name: 'Max', age: 25 },
                { id: 3, name: 'Roger', age: 35 },
                { id: 4, name: 'Petr', age: 40 }
            ]);

            people.sort((a, b) => b.age - a.age);

            expect(people.selectAll()).toEqual([
                { id: 4, name: 'Petr', age: 40 },
                { id: 3, name: 'Roger', age: 35 },
                { id: 1, name: 'Max', age: 25 },
                { id: 2, name: 'Ivan', age: 15 },
                { id: 5, name: 'Anton', age: 12 }
            ]);

            expect(people.getState()).toEqual({
                ids: [4, 3, 1, 2, 5],
                entities: {
                    '1': { id: 1, name: 'Max', age: 25 },
                    '2': { id: 2, name: 'Ivan', age: 15 },
                    '3': { id: 3, name: 'Roger', age: 35 },
                    '4': { id: 4, name: 'Petr', age: 40 },
                    '5': { id: 5, name: 'Anton', age: 12 }
                }
            });
        })
    );

    it(
        "{ sortByOrder: '' } not supported",
        ngxsTestingPlatform([PeopleEntitiesState], (_, people) => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            expect(people.selectAll()).toEqual([
                { id: 1, name: 'Max', age: 25 },
                { id: 2, name: 'Ivan', age: 15 },
                { id: 3, name: 'Roger', age: 35 },
                { id: 4, name: 'Petr', age: 40 },
                { id: 5, name: 'Anton', age: 12 }
            ]);

            people.setComparator({ sortBy: 'age', sortByOrder: '' });
            people.sort();

            expect(people.selectAll()).toEqual([
                { id: 1, name: 'Max', age: 25 },
                { id: 2, name: 'Ivan', age: 15 },
                { id: 3, name: 'Roger', age: 35 },
                { id: 4, name: 'Petr', age: 40 },
                { id: 5, name: 'Anton', age: 12 }
            ]);

            expect(spy).toHaveBeenCalledTimes(1);

            expect(console.warn).toHaveBeenLastCalledWith('Invalid --> { sortByOrder: "" } not supported!');
        })
    );

    afterEach(() => {
        spy.mockClear();
    });
});
