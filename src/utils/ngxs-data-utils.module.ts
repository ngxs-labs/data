import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxsDataMutablePipe } from './pipes/mutable/ngxs-data-mutable.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [NgxsDataMutablePipe],
    exports: [NgxsDataMutablePipe]
})
export class NgxsDataUtilsModule {}
