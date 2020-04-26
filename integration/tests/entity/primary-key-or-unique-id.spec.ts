import { ngxsTestingPlatform } from '@ngxs-labs/data/testing';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { Action, State } from '@ngxs/store';
import { createEntityCollections } from '@ngxs-labs/data/utils';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { EntityDictionary, EntityIdType, NgxsEntityCollections } from '@ngxs-labs/data/typings';

describe('[TEST]: Entity - primary key or unique id', () => {
    interface Lesson {
        lessonId: number;
        title: string;
    }

    describe('Incorrect lesson state', () => {
        @StateRepository()
        @State({
            name: 'lesson',
            defaults: createEntityCollections()
        })
        class LessonEntitiesState extends NgxsDataEntityCollectionsRepository<Lesson> {
            public set(val: NgxsEntityCollections<Lesson, string | number>): void {
                this.setEntitiesState(val);
            }

            @Action({
                type: 'preparedLesson'
            })
            public preparedLesson() {
                this.addEntityOne({ lessonId: 2, title: 'B' });
            }
        }

        it(
            "The entity passed to the 'selectId' implementation returned undefined",
            ngxsTestingPlatform([LessonEntitiesState], (_store, lesson) => {
                expect(lesson.getState()).toEqual({ ids: [], entities: {} });

                const spy = jest.spyOn(console, 'warn').mockImplementation();

                lesson.setAll([{ lessonId: 1, title: 'A' }]);

                expect(spy).toHaveBeenCalledTimes(1);
                expect(console.warn).toHaveBeenLastCalledWith(
                    "The entity passed to the 'selectId' implementation returned undefined.",
                    "You should probably provide your own 'selectId' implementation.",
                    'The entity that was passed:',
                    { lessonId: 1, title: 'A' },
                    'The current `selectId` implementation: (entity: V): K => entity.id'
                );

                expect(lesson.selectId(null!)).toEqual(undefined);

                expect(lesson.getState()).toEqual({
                    ids: [undefined],
                    entities: { undefined: { lessonId: 1, title: 'A' } }
                });

                lesson.set(createEntityCollections());
                expect(lesson.getState()).toEqual({ ids: [], entities: {} });

                lesson.dispatch({ type: 'preparedLesson' });

                expect(lesson.getState()).toEqual({
                    ids: [undefined],
                    entities: { undefined: { lessonId: 2, title: 'B' } }
                });
            })
        );
    });

    describe('changed primaryKey', () => {
        @StateRepository()
        @State({
            name: 'lesson',
            defaults: createEntityCollections()
        })
        class LessonEntitiesState extends NgxsDataEntityCollectionsRepository<Lesson> {
            public primaryKey: string = 'lessonId';
        }

        it(
            'correct expose lesson id',
            ngxsTestingPlatform([LessonEntitiesState], (_store, lesson) => {
                expect(lesson.getState()).toEqual({ ids: [], entities: {} });

                lesson.setAll([
                    { lessonId: 1, title: 'A' },
                    { lessonId: 2, title: 'B' }
                ]);

                expect(lesson.getState()).toEqual({
                    ids: [1, 2],
                    entities: {
                        '1': { lessonId: 1, title: 'A' },
                        '2': { lessonId: 2, title: 'B' }
                    }
                });
            })
        );
    });

    describe('override change selectId', () => {
        @StateRepository()
        @State({
            name: 'lesson',
            defaults: createEntityCollections()
        })
        class LessonEntitiesState extends NgxsDataEntityCollectionsRepository<Lesson> {
            public selectId(entity: Lesson): EntityIdType {
                return entity.lessonId;
            }
        }

        it(
            'correct expose lesson id with override selectId',
            ngxsTestingPlatform([LessonEntitiesState], (_store, lesson) => {
                expect(lesson.getState()).toEqual({ ids: [], entities: {} });

                lesson.setAll([
                    { lessonId: 1, title: 'A' },
                    { lessonId: 2, title: 'B' },
                    { lessonId: 3, title: 'C' }
                ]);

                expect(lesson.getState()).toEqual({
                    ids: [1, 2, 3],
                    entities: {
                        '1': { lessonId: 1, title: 'A' },
                        '2': { lessonId: 2, title: 'B' },
                        '3': { lessonId: 3, title: 'C' }
                    }
                });

                lesson.removeByEntities([
                    { lessonId: 1, title: 'A' },
                    { lessonId: 2, title: 'B' },
                    { lessonId: 3, title: 'C' }
                ]);

                expect(lesson.getState()).toEqual({ ids: [], entities: {} });

                lesson.updateOne({ id: 1, changes: { lessonId: 1, title: 'A' } });
                expect(lesson.getState()).toEqual({ ids: [], entities: {} });

                lesson.upsertMany([
                    { lessonId: 1, title: 'A' },
                    { lessonId: 2, title: 'B' },
                    { lessonId: 3, title: 'C' }
                ]);

                expect(lesson.getState()).toEqual({
                    ids: [1, 2, 3],
                    entities: {
                        '1': { lessonId: 1, title: 'A' },
                        '2': { lessonId: 2, title: 'B' },
                        '3': { lessonId: 3, title: 'C' }
                    }
                });

                lesson.updateMany([
                    { id: 1, changes: { title: 'A*' } },
                    { id: 3, changes: { title: 'C*' } },
                    { id: 4, changes: { title: 'G*' } }
                ]);

                expect(lesson.getState()).toEqual({
                    ids: [1, 2, 3],
                    entities: {
                        '1': { lessonId: 1, title: 'A*' },
                        '2': { lessonId: 2, title: 'B' },
                        '3': { lessonId: 3, title: 'C*' }
                    }
                });

                lesson.upsertOne({ lessonId: 0, title: 'R' });

                expect(lesson.getState()).toEqual({
                    ids: [1, 2, 3, 0],
                    entities: {
                        '1': { lessonId: 1, title: 'A*' },
                        '2': { lessonId: 2, title: 'B' },
                        '3': { lessonId: 3, title: 'C*' },
                        '0': { lessonId: 0, title: 'R' }
                    }
                });

                lesson.updateOne({ id: 0, changes: { title: 'R*' } });

                expect(lesson.getState()).toEqual({
                    ids: [1, 2, 3, 0],
                    entities: {
                        '0': { lessonId: 0, title: 'R*' },
                        '1': { lessonId: 1, title: 'A*' },
                        '2': { lessonId: 2, title: 'B' },
                        '3': { lessonId: 3, title: 'C*' }
                    }
                });
            })
        );
    });

    describe('Composite key', () => {
        interface StudentEntity {
            groupId: number;
            batchId: number;
            name: string;
            course: string;
            dateOfBirth: Date;
        }

        @StateRepository()
        @State({
            name: 'student',
            defaults: createEntityCollections()
        })
        class StudentEntitiesState extends NgxsDataEntityCollectionsRepository<StudentEntity, string> {
            public selectId(entity: StudentEntity): string {
                return `${entity.groupId}_${entity.batchId}`;
            }
        }

        it(
            'correct create entities with composite keys',
            ngxsTestingPlatform([StudentEntitiesState], (_store, studentEntities) => {
                const idEvents: string[][] = [];
                const entityEvents: EntityDictionary<string, StudentEntity>[] = [];

                studentEntities.ids$.subscribe((ids) => {
                    idEvents.push(ids);
                });

                studentEntities.entities$.subscribe((entities) => {
                    entityEvents.push(entities);
                });

                expect(studentEntities.getState()).toEqual({ ids: [], entities: {} });

                studentEntities.setAll([
                    {
                        groupId: 1,
                        batchId: 1,
                        name: 'Maxim',
                        course: 'Super A',
                        dateOfBirth: new Date(1994, 5, 1)
                    },
                    {
                        groupId: 1,
                        batchId: 2,
                        name: 'Ivan',
                        course: 'Super A',
                        dateOfBirth: new Date(1993, 5, 12)
                    },
                    {
                        groupId: 2,
                        batchId: 1,
                        name: 'Nikola',
                        course: 'Super B',
                        dateOfBirth: new Date(1997, 7, 11)
                    },
                    {
                        groupId: 2,
                        batchId: 2,
                        name: 'Petr',
                        course: 'Super C',
                        dateOfBirth: new Date(1994, 3, 11)
                    }
                ]);

                expect(studentEntities.getState()).toEqual({
                    ids: ['1_1', '1_2', '2_1', '2_2'],
                    entities: {
                        '1_1': {
                            groupId: 1,
                            batchId: 1,
                            name: 'Maxim',
                            course: 'Super A',
                            dateOfBirth: expect.any(Date)
                        },
                        '1_2': {
                            groupId: 1,
                            batchId: 2,
                            name: 'Ivan',
                            course: 'Super A',
                            dateOfBirth: expect.any(Date)
                        },
                        '2_1': {
                            groupId: 2,
                            batchId: 1,
                            name: 'Nikola',
                            course: 'Super B',
                            dateOfBirth: expect.any(Date)
                        },
                        '2_2': {
                            groupId: 2,
                            batchId: 2,
                            name: 'Petr',
                            course: 'Super C',
                            dateOfBirth: expect.any(Date)
                        }
                    }
                });

                studentEntities.reset();

                expect(studentEntities.getState()).toEqual({ ids: [], entities: {} });

                studentEntities.addOne({
                    groupId: 1,
                    batchId: 1,
                    name: 'Maxim',
                    course: 'Super A',
                    dateOfBirth: new Date(1994, 5, 1)
                });

                expect(studentEntities.ids).toEqual(['1_1']);
                expect(studentEntities.entities).toEqual({
                    '1_1': {
                        groupId: 1,
                        batchId: 1,
                        name: 'Maxim',
                        course: 'Super A',
                        dateOfBirth: expect.any(Date)
                    }
                });

                studentEntities.removeAll();

                expect(studentEntities.ids).toEqual([]);
                expect(studentEntities.entities).toEqual({});

                const entity: StudentEntity = {
                    groupId: 4,
                    batchId: 1,
                    name: 'Mark',
                    course: 'Super D',
                    dateOfBirth: new Date(1972, 5, 1)
                };

                studentEntities.upsertOne(entity);

                expect(studentEntities.getState()).toEqual({
                    ids: ['4_1'],
                    entities: {
                        '4_1': {
                            groupId: 4,
                            batchId: 1,
                            name: 'Mark',
                            course: 'Super D',
                            dateOfBirth: expect.any(Date)
                        }
                    }
                });

                expect(studentEntities.selectOne('4_1')).toEqual({
                    groupId: 4,
                    batchId: 1,
                    name: 'Mark',
                    course: 'Super D',
                    dateOfBirth: expect.any(Date)
                });

                expect(studentEntities.selectOne('4_6')).toEqual(null);

                expect(studentEntities.selectAll()).toEqual([
                    {
                        groupId: 4,
                        batchId: 1,
                        name: 'Mark',
                        course: 'Super D',
                        dateOfBirth: expect.any(Date)
                    }
                ]);

                studentEntities.removeByEntity(entity);
                expect(studentEntities.selectAll()).toEqual([]);

                expect(idEvents).toEqual([[], ['1_1', '1_2', '2_1', '2_2'], [], ['1_1'], [], ['4_1'], []]);

                expect(entityEvents).toEqual([
                    {},
                    {
                        '1_1': {
                            groupId: 1,
                            batchId: 1,
                            name: 'Maxim',
                            course: 'Super A',
                            dateOfBirth: expect.any(Date)
                        },
                        '1_2': {
                            groupId: 1,
                            batchId: 2,
                            name: 'Ivan',
                            course: 'Super A',
                            dateOfBirth: expect.any(Date)
                        },
                        '2_1': {
                            groupId: 2,
                            batchId: 1,
                            name: 'Nikola',
                            course: 'Super B',
                            dateOfBirth: expect.any(Date)
                        },
                        '2_2': {
                            groupId: 2,
                            batchId: 2,
                            name: 'Petr',
                            course: 'Super C',
                            dateOfBirth: expect.any(Date)
                        }
                    },
                    {},
                    {
                        '1_1': {
                            groupId: 1,
                            batchId: 1,
                            name: 'Maxim',
                            course: 'Super A',
                            dateOfBirth: expect.any(Date)
                        }
                    },
                    {},
                    {
                        '4_1': {
                            groupId: 4,
                            batchId: 1,
                            name: 'Mark',
                            course: 'Super D',
                            dateOfBirth: expect.any(Date)
                        }
                    },
                    {}
                ]);
            })
        );
    });
});
