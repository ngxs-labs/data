import { createEntityCollections } from '@angular-ru/common/entity';
import { Injectable } from '@angular/core';
import { Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';

import { Article } from './article.interface';

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
