import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { CountComponent } from './count.component';
import { CountState } from './count.state';
import { FormsModule } from '@angular/forms';
import { CountSubState } from './count-sub.state';
import { NgxsDataUtilsModule } from '@ngxs-labs/data';

@NgModule({
    declarations: [CountComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgxsModule.forFeature([CountState, CountSubState]),
        NgxsDataUtilsModule,
        RouterModule.forChild([{ path: '', component: CountComponent }])
    ]
})
export class CountModule {}
