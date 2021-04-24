import { createEntityCollections, EntityIdType } from '@angular-ru/common/entity';
import { Injectable } from '@angular/core';
import { Computed, DataAction, Payload, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataEntityCollectionsRepository, NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { ngxsTestingPlatform } from '@ngxs-labs/data/testing';
import { State } from '@ngxs/store';

describe('[TEST]: Entity', () => {
    it('should be correct create defaults', () => {
        expect(createEntityCollections()).toEqual({ ids: [], entities: {} });

        expect(
            createEntityCollections({
                ids: [1, 2, 3],
                entities: {
                    1: { a: 1 },
                    2: { a: 2 },
                    3: { a: 3 }
                }
            })
        ).toEqual({
            ids: [1, 2, 3],
            entities: {
                1: { a: 1 },
                2: { a: 2 },
                3: { a: 3 }
            }
        });
    });

    interface Article {
        id: number;
        title: string;
        category: string;
    }

    describe('Nested Collection Entities', () => {
        interface ArticleOptions {
            loading: boolean;
            category: string;
        }

        class MyCollectionState<V, K extends EntityIdType = EntityIdType> extends NgxsDataEntityCollectionsRepository<
            V,
            K,
            ArticleOptions
        > {
            @Computed()
            public get loading(): boolean {
                return this.snapshot.loading;
            }

            @Computed()
            public get category(): string {
                return this.snapshot.category;
            }

            @DataAction()
            public setLoading(@Payload('loading') loading: boolean): void {
                const state = this.getState();
                this.setEntitiesState({
                    ...state,
                    loading
                });
            }

            @DataAction()
            public setCategory(@Payload('category') category: string): void {
                const state = this.getState();
                this.setEntitiesState({
                    ...state,
                    category
                });
            }
        }

        @StateRepository()
        @State({
            name: 'articles',
            defaults: {
                ...createEntityCollections(),
                loading: false,
                category: undefined
            }
        })
        @Injectable()
        class ArticlesState extends MyCollectionState<Article, number> {}

        @StateRepository()
        @State({
            name: 'entityCache',
            defaults: {},
            children: [ArticlesState]
        })
        @Injectable()
        class EntityCacheState extends NgxsDataRepository<any> {}

        it(
            'should work with children',
            ngxsTestingPlatform([EntityCacheState, ArticlesState], (store, entityCache, articles) => {
                expect(store).toBeDefined();
                expect(entityCache).toBeDefined();
                expect(articles).toBeDefined();

                expect(articles.snapshot.category).toBeUndefined();
                expect(articles.snapshot.loading).toBeFalsy();

                articles.setCategory('Merchandise');
                expect(articles.snapshot.category).toEqual('Merchandise');

                articles.setLoading(true);
                expect(articles.snapshot.loading).toBeTruthy();

                // Reset self and all children
                entityCache.reset();
                expect(articles.snapshot.category).toBeUndefined();
                expect(articles.snapshot.loading).toBeFalsy();
            })
        );
    });

    describe('Article Entity', () => {
        @StateRepository()
        @State({
            name: 'article',
            defaults: createEntityCollections()
        })
        @Injectable()
        class ArticleEntitiesState extends NgxsDataEntityCollectionsRepository<Article> {}

        it(
            '@article.addOne(entity: V)',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.addOne({ id: 5, title: 'Hello', category: 'World' });

                expect(store.snapshot()).toEqual({
                    article: {
                        ids: [5],
                        entities: {
                            5: { id: 5, title: 'Hello', category: 'World' }
                        }
                    }
                });

                expect(article.getState()).toEqual({
                    ids: [5],
                    entities: { '5': { id: 5, title: 'Hello', category: 'World' } }
                });

                expect(article.snapshot).toEqual({
                    ids: [5],
                    entities: { '5': { id: 5, title: 'Hello', category: 'World' } }
                });

                // if value with ID: 5 exist then not affected
                article.addOne({ id: 5, title: 'A', category: 'A' });
                article.addOne({ id: 5, title: 'B', category: 'B' });

                expect(article.getState()).toEqual({
                    ids: [5],
                    entities: { '5': { id: 5, title: 'Hello', category: 'World' } }
                });

                expect(article.snapshot).toEqual({
                    ids: [5],
                    entities: { '5': { id: 5, title: 'Hello', category: 'World' } }
                });
            })
        );

        it(
            '@article.addMany(entities: V[])',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.addMany([
                    { id: 1, title: 'A', category: 'A' },
                    { id: 2, title: 'B', category: 'B' },
                    { id: 3, title: 'C', category: 'C' },

                    // duplicate
                    { id: 1, title: 'A1', category: 'A1' },
                    { id: 2, title: 'B1', category: 'B1' },
                    { id: 3, title: 'C1', category: 'C1' }
                ]);

                expect(store.snapshot()).toEqual({
                    article: {
                        ids: [1, 2, 3],
                        entities: {
                            '1': { id: 1, title: 'A', category: 'A' },
                            '2': { id: 2, title: 'B', category: 'B' },
                            '3': { id: 3, title: 'C', category: 'C' }
                        }
                    }
                });

                expect(article.snapshot).toEqual({
                    ids: [1, 2, 3],
                    entities: {
                        '1': { id: 1, title: 'A', category: 'A' },
                        '2': { id: 2, title: 'B', category: 'B' },
                        '3': { id: 3, title: 'C', category: 'C' }
                    }
                });
            })
        );

        it(
            '@article.addAll(entities: V[])',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_0', category: 'A_0' },
                    { id: 2, title: 'B_0', category: 'B_0' },
                    { id: 3, title: 'C_0', category: 'C_0' },

                    // DUPLICATE
                    { id: 3, title: 'C_DUPLICATE', category: 'C_DUPLICATE' }
                ]);

                expect(store.snapshot()).toEqual({
                    article: {
                        ids: [1, 2, 3],
                        entities: {
                            '1': { id: 1, title: 'A_0', category: 'A_0' },
                            '2': { id: 2, title: 'B_0', category: 'B_0' },
                            '3': { id: 3, title: 'C_0', category: 'C_0' }
                        }
                    }
                });

                expect(article.snapshot).toEqual({
                    ids: [1, 2, 3],
                    entities: {
                        '1': { id: 1, title: 'A_0', category: 'A_0' },
                        '2': { id: 2, title: 'B_0', category: 'B_0' },
                        '3': { id: 3, title: 'C_0', category: 'C_0' }
                    }
                });

                article.setAll([
                    { id: 1, title: 'A1', category: 'A1' },
                    { id: 2, title: 'B1', category: 'B1' },
                    { id: 3, title: 'C1', category: 'C1' },

                    // DUPLICATE
                    { id: 3, title: 'C1_DUPLICATE', category: 'C1_DUPLICATE' }
                ]);

                expect(store.snapshot()).toEqual({
                    article: {
                        ids: [1, 2, 3],
                        entities: {
                            '1': { id: 1, title: 'A1', category: 'A1' },
                            '2': { id: 2, title: 'B1', category: 'B1' },
                            '3': { id: 3, title: 'C1', category: 'C1' }
                        }
                    }
                });

                expect(article.snapshot).toEqual({
                    ids: [1, 2, 3],
                    entities: {
                        '1': { id: 1, title: 'A1', category: 'A1' },
                        '2': { id: 2, title: 'B1', category: 'B1' },
                        '3': { id: 3, title: 'C1', category: 'C1' }
                    }
                });
            })
        );

        it(
            '@article.setOne(entity: V)',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_3', category: 'A_3' },
                    { id: 2, title: 'B_3', category: 'B_3' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2],
                    entities: {
                        '1': { id: 1, title: 'A_3', category: 'A_3' },
                        '2': { id: 2, title: 'B_3', category: 'B_3' }
                    }
                });

                article.setOne({ id: 1, title: 'Hello', category: 'World' });

                expect(article.getState()).toEqual({
                    ids: [1, 2],
                    entities: {
                        '1': { id: 1, title: 'Hello', category: 'World' },
                        '2': { id: 2, title: 'B_3', category: 'B_3' }
                    }
                });

                article.setOne({ id: 3, title: 'World', category: 'Hello' });

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3],
                    entities: {
                        '1': { id: 1, title: 'Hello', category: 'World' },
                        '2': { id: 2, title: 'B_3', category: 'B_3' },
                        '3': { id: 3, title: 'World', category: 'Hello' }
                    }
                });
            })
        );

        it(
            '@article.setMany(entities: V[])',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_3', category: 'A_3' },
                    { id: 2, title: 'B_3', category: 'B_3' },
                    { id: 3, title: 'C_3', category: 'C_3' },
                    { id: 4, title: 'D_3', category: 'D_4' }
                ]);

                article.setMany([{ id: 3, title: 'C_3_1', category: 'C_3_1' }]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_3', category: 'A_3' },
                        '2': { id: 2, title: 'B_3', category: 'B_3' },
                        '3': { id: 3, title: 'C_3_1', category: 'C_3_1' },
                        '4': { id: 4, title: 'D_3', category: 'D_4' }
                    }
                });

                article.setMany([
                    { id: 3, title: 'C_3_2', category: 'C_3_2' },
                    { id: 5, title: 'E_3_2', category: 'E_3_2' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4, 5],
                    entities: {
                        '1': { id: 1, title: 'A_3', category: 'A_3' },
                        '2': { id: 2, title: 'B_3', category: 'B_3' },
                        '3': { id: 3, title: 'C_3_2', category: 'C_3_2' },
                        '4': { id: 4, title: 'D_3', category: 'D_4' },
                        '5': { id: 5, title: 'E_3_2', category: 'E_3_2' }
                    }
                });
            })
        );

        it(
            '@article.setAll(entities: V[])',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_Z', category: 'A_Z' },
                    { id: 2, title: 'B_Z', category: 'B_Z' },
                    { id: 3, title: 'C_Z', category: 'C_Z' },
                    { id: 4, title: 'D_Z', category: 'D_Z' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_Z', category: 'A_Z' },
                        '2': { id: 2, title: 'B_Z', category: 'B_Z' },
                        '3': { id: 3, title: 'C_Z', category: 'C_Z' },
                        '4': { id: 4, title: 'D_Z', category: 'D_Z' }
                    }
                });

                article.setAll([{ id: 3, title: 'C_3_1', category: 'C_3_1' }]);

                expect(article.getState()).toEqual({
                    ids: [3],
                    entities: { '3': { id: 3, title: 'C_3_1', category: 'C_3_1' } }
                });

                article.setAll([
                    { id: 3, title: 'C_3_2', category: 'C_3_2' },
                    { id: 5, title: 'E_3_2', category: 'E_3_2' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [3, 5],
                    entities: {
                        '3': { id: 3, title: 'C_3_2', category: 'C_3_2' },
                        '5': { id: 5, title: 'E_3_2', category: 'E_3_2' }
                    }
                });
            })
        );

        it(
            '@article.updateOne(update: EntityUpdate<V, K>)',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_G', category: 'A_G' },
                    { id: 2, title: 'B_G', category: 'B_G' },
                    { id: 3, title: 'C_G', category: 'C_G' },
                    { id: 4, title: 'D_G', category: 'D_G' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_G', category: 'A_G' },
                        '2': { id: 2, title: 'B_G', category: 'B_G' },
                        '3': { id: 3, title: 'C_G', category: 'C_G' },
                        '4': { id: 4, title: 'D_G', category: 'D_G' }
                    }
                });

                article.updateOne({ id: 5, changes: { title: 'H_H_1' } });
                article.updateOne({ id: 1, changes: { title: 'A_G_1' } });

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_G_1', category: 'A_G' },
                        '2': { id: 2, title: 'B_G', category: 'B_G' },
                        '3': { id: 3, title: 'C_G', category: 'C_G' },
                        '4': { id: 4, title: 'D_G', category: 'D_G' }
                    }
                });

                article.updateOne({ id: 3, changes: { title: 'C_C_1', category: 'HELLO', id: 199 } });
                expect(article.getState()).toEqual({
                    ids: [1, 2, 199, 4],
                    entities: {
                        '1': { id: 1, title: 'A_G_1', category: 'A_G' },
                        '2': { id: 2, title: 'B_G', category: 'B_G' },
                        '4': { id: 4, title: 'D_G', category: 'D_G' },
                        '199': { id: 199, title: 'C_C_1', category: 'HELLO' }
                    }
                });
            })
        );

        it(
            '@article.updateMany(updates: EntityUpdate<V, K>[])',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_R', category: 'A_R' },
                    { id: 2, title: 'B_R', category: 'B_R' },
                    { id: 3, title: 'C_R', category: 'C_R' },
                    { id: 4, title: 'D_R', category: 'D_R' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_R', category: 'A_R' },
                        '2': { id: 2, title: 'B_R', category: 'B_R' },
                        '3': { id: 3, title: 'C_R', category: 'C_R' },
                        '4': { id: 4, title: 'D_R', category: 'D_R' }
                    }
                });

                article.updateMany([
                    { id: 1, changes: { title: 'A_H_2' } },
                    { id: 2, changes: { title: 'B_G_2' } },
                    { id: 2, changes: { title: 'B_G_2_1' } },
                    { id: 2, changes: { title: 'B_G_2_2' } },
                    { id: 20, changes: { title: 'B_G_2' } }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_H_2', category: 'A_R' },
                        '2': { id: 2, title: 'B_G_2_2', category: 'B_R' },
                        '3': { id: 3, title: 'C_R', category: 'C_R' },
                        '4': { id: 4, title: 'D_R', category: 'D_R' }
                    }
                });
            })
        );

        it(
            '@article.upsertOne(entity: V)',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_U', category: 'A_U' },
                    { id: 2, title: 'B_U', category: 'B_U' },
                    { id: 3, title: 'C_U', category: 'C_U' },
                    { id: 4, title: 'D_U', category: 'D_U' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_U', category: 'A_U' },
                        '2': { id: 2, title: 'B_U', category: 'B_U' },
                        '3': { id: 3, title: 'C_U', category: 'C_U' },
                        '4': { id: 4, title: 'D_U', category: 'D_U' }
                    }
                });

                article.upsertOne({ id: 2, title: 'B_U_X', category: 'B_U' });
                article.upsertOne({ id: 23, title: 'F_U_X', category: 'F_B_U' });

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4, 23],
                    entities: {
                        '1': { id: 1, title: 'A_U', category: 'A_U' },
                        '2': { id: 2, title: 'B_U_X', category: 'B_U' },
                        '3': { id: 3, title: 'C_U', category: 'C_U' },
                        '4': { id: 4, title: 'D_U', category: 'D_U' },
                        '23': { id: 23, title: 'F_U_X', category: 'F_B_U' }
                    }
                });
            })
        );

        it(
            '@article.upsertMany(entities: V[])',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_O', category: 'A_O' },
                    { id: 2, title: 'B_O', category: 'B_O' },
                    { id: 3, title: 'C_O', category: 'C_O' },
                    { id: 4, title: 'D_O', category: 'D_O' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_O', category: 'A_O' },
                        '2': { id: 2, title: 'B_O', category: 'B_O' },
                        '3': { id: 3, title: 'C_O', category: 'C_O' },
                        '4': { id: 4, title: 'D_O', category: 'D_O' }
                    }
                });

                article.upsertMany([
                    { id: 23, title: 'F_U_X', category: 'F_B_U' },
                    { id: 2, title: 'B_U_X', category: 'B_U' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4, 23],
                    entities: {
                        '1': { id: 1, title: 'A_O', category: 'A_O' },
                        '2': { id: 2, title: 'B_U_X', category: 'B_U' },
                        '3': { id: 3, title: 'C_O', category: 'C_O' },
                        '4': { id: 4, title: 'D_O', category: 'D_O' },
                        '23': { id: 23, title: 'F_U_X', category: 'F_B_U' }
                    }
                });
            })
        );

        it(
            '@article.removeOne(entity: V)',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_R', category: 'A_O' },
                    { id: 2, title: 'B_R', category: 'B_O' },
                    { id: 3, title: 'C_R', category: 'C_O' },
                    { id: 4, title: 'D_R', category: 'D_O' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_R', category: 'A_O' },
                        '2': { id: 2, title: 'B_R', category: 'B_O' },
                        '3': { id: 3, title: 'C_R', category: 'C_O' },
                        '4': { id: 4, title: 'D_R', category: 'D_O' }
                    }
                });

                article.removeOne(1);
                article.removeOne(3);

                expect(article.getState()).toEqual({
                    ids: [2, 4],
                    entities: {
                        '2': { id: 2, title: 'B_R', category: 'B_O' },
                        '4': { id: 4, title: 'D_R', category: 'D_O' }
                    }
                });

                article.removeOne('2');

                expect(article.getState()).toEqual({
                    ids: [4],
                    entities: {
                        '4': { id: 4, title: 'D_R', category: 'D_O' }
                    }
                });
            })
        );

        it(
            '@article.removeMany(entities: V[])',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_F', category: 'A_O' },
                    { id: 2, title: 'B_F', category: 'B_O' },
                    { id: 3, title: 'C_F', category: 'C_O' },
                    { id: 4, title: 'D_F', category: 'D_O' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_F', category: 'A_O' },
                        '2': { id: 2, title: 'B_F', category: 'B_O' },
                        '3': { id: 3, title: 'C_F', category: 'C_O' },
                        '4': { id: 4, title: 'D_F', category: 'D_O' }
                    }
                });

                article.removeMany([
                    1,
                    2,
                    2, // duplicate
                    2, // duplicate
                    '3'
                ]);

                expect(article.getState()).toEqual({
                    ids: [4],
                    entities: { '4': { id: 4, title: 'D_F', category: 'D_O' } }
                });
            })
        );

        it(
            '@article.removeAll()',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });

                article.setAll([
                    { id: 1, title: 'A_W', category: 'A_O' },
                    { id: 2, title: 'B_W', category: 'B_O' },
                    { id: 3, title: 'C_W', category: 'C_O' },
                    { id: 4, title: 'D_W', category: 'D_O' }
                ]);

                expect(article.getState()).toEqual({
                    ids: [1, 2, 3, 4],
                    entities: {
                        '1': { id: 1, title: 'A_W', category: 'A_O' },
                        '2': { id: 2, title: 'B_W', category: 'B_O' },
                        '3': { id: 3, title: 'C_W', category: 'C_O' },
                        '4': { id: 4, title: 'D_W', category: 'D_O' }
                    }
                });

                article.removeAll();

                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.getState()).toEqual({ ids: [], entities: {} });
            })
        );

        it(
            '@article.entities',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.entities).toEqual({});

                article.setAll([
                    { id: 1, title: 'A_W', category: 'A_O' },
                    { id: 2, title: 'B_W', category: 'B_O' },
                    { id: 3, title: 'C_W', category: 'C_O' },
                    { id: 4, title: 'D_W', category: 'D_O' }
                ]);

                expect(article.entities).toEqual({
                    '1': { id: 1, title: 'A_W', category: 'A_O' },
                    '2': { id: 2, title: 'B_W', category: 'B_O' },
                    '3': { id: 3, title: 'C_W', category: 'C_O' },
                    '4': { id: 4, title: 'D_W', category: 'D_O' }
                });
            })
        );

        it(
            '@article.entitiesArray',
            ngxsTestingPlatform([ArticleEntitiesState], (store, article) => {
                expect(store.snapshot()).toEqual({ article: { ids: [], entities: {} } });
                expect(article.entitiesArray).toEqual([]);

                article.setAll([
                    { id: 1, title: 'A_W', category: 'A_O' },
                    { id: 2, title: 'B_W', category: 'B_O' },
                    { id: 3, title: 'C_W', category: 'C_O' },
                    { id: 4, title: 'D_W', category: 'D_O' }
                ]);

                expect(article.entitiesArray).toEqual([
                    { id: 1, title: 'A_W', category: 'A_O' },
                    { id: 2, title: 'B_W', category: 'B_O' },
                    { id: 3, title: 'C_W', category: 'C_O' },
                    { id: 4, title: 'D_W', category: 'D_O' }
                ]);
            })
        );
    });
});
