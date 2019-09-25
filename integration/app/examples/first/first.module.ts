import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { FirstComponent } from './first.component';
import { CountState } from './count/count.state';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [FirstComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgxsModule.forFeature([CountState]),
        RouterModule.forChild([{ path: '', component: FirstComponent }])
    ]
})
export class FirstModule {}
