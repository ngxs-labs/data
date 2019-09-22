import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { FirstComponent } from './first.component';
import { CountState } from './count/count.state';

@NgModule({
  declarations: [FirstComponent],
  imports: [
    CommonModule,
    NgxsModule.forFeature([CountState]),
    RouterModule.forChild([{ path: '', component: FirstComponent }])
  ]
})
export class FirstModule {}
