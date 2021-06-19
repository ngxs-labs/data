import { Injectable } from '@angular/core';
import { createEntityCollections } from '@angular-ru/common/entity';
import { State } from '@ngxs/store';
import { Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';

import { Article } from './article';

@Persistence({
    existingEngine: localStorage
})
@StateRepository()
@State({
    name: 'articles',
    defaults: createEntityCollections()
})
@Injectable()
export class ArticleEntitiesState extends NgxsDataEntityCollectionsRepository<Article, string> {
    public primaryKey: string = 'uid';
}
