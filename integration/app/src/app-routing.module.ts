/* eslint-disable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    redirectTo: 'count',
                    pathMatch: 'full'
                },
                {
                    path: 'count',
                    loadChildren: () => import('./examples/count/count.module').then((m) => m.CountModule)
                },
                {
                    path: 'todo',
                    loadChildren: () => import('./examples/todo/todo.module').then((m) => m.TodoModule)
                },
                {
                    path: 'person',
                    loadChildren: () => import('./examples/person/person.module').then((m) => m.PersonModule)
                },
                {
                    path: 'amount',
                    loadChildren: () => import('./examples/amount/amount.module').then((m) => m.AmountModule)
                },
                {
                    path: 'article',
                    loadChildren: () => import('./examples/article/article.module').then((m) => m.ArticleModule)
                }
            ],
            { useHash: true, relativeLinkResolution: 'legacy' }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
