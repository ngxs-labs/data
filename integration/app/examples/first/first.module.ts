import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { FirstComponent } from './first.component';
import { CountState } from './count/count.state';
import { FormsModule } from '@angular/forms';
import { DeepCountState } from './count/deep-count.state';

@NgModule({
    declarations: [FirstComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgxsModule.forFeature([CountState, DeepCountState]),
        RouterModule.forChild([{ path: '', component: FirstComponent }])
    ]
})
export class FirstModule {}
