import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CountModule } from './examples/count/count.module';
import { TodoModule } from './examples/todo/todo.module';

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
                    loadChildren: (): Promise<CountModule> =>
                        import('./examples/count/count.module').then(
                            (m: { CountModule: CountModule }): CountModule => m.CountModule
                        )
                },
                {
                    path: 'todo',
                    loadChildren: (): Promise<TodoModule> =>
                        import('./examples/todo/todo.module').then(
                            (m: { TodoModule: TodoModule }): TodoModule => m.TodoModule
                        )
                }
            ],
            { useHash: true }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
