import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsDataUtilsModule } from '@ngxs-labs/data/utils';
import { NgxsModule } from '@ngxs/store';

import { CountSubState } from './count-sub.state';
import { CountComponent } from './count.component';
import { CountState } from './count.state';

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
