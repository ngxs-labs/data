import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirstComponent } from './first.component';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
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
