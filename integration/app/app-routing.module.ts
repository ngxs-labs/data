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
                }
            ],
            { useHash: true }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
