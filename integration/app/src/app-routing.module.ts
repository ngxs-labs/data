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
                    // eslint-disable-next-line @typescript-eslint/tslint/config,@typescript-eslint/explicit-function-return-type
                    loadChildren: () => import('./examples/count/count.module').then((m) => m.CountModule)
                },
                {
                    path: 'todo',
                    // eslint-disable-next-line @typescript-eslint/tslint/config,@typescript-eslint/explicit-function-return-type
                    loadChildren: () => import('./examples/todo/todo.module').then((m) => m.TodoModule)
                },
                {
                    path: 'person',
                    // eslint-disable-next-line @typescript-eslint/tslint/config,@typescript-eslint/explicit-function-return-type
                    loadChildren: () => import('./examples/person/person.module').then((m) => m.PersonModule)
                },
                {
                    path: 'amount',
                    // eslint-disable-next-line @typescript-eslint/tslint/config,@typescript-eslint/explicit-function-return-type
                    loadChildren: () => import('./examples/amount/amount.module').then((m) => m.AmountModule)
                }
            ],
            { useHash: true }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
