import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { TodoComponent } from './todo.component';
import { TodoState } from './todo.state';

@NgModule({
    declarations: [TodoComponent],
    imports: [
        CommonModule,
        MatSnackBarModule,
        NgxsModule.forFeature([TodoState]),
        RouterModule.forChild([{ path: '', component: TodoComponent }])
    ]
})
export class TodoModule {}
