import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsDataMutablePipe } from './pipes/ngxs-data-mutable.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [NgxsDataMutablePipe],
    exports: [NgxsDataMutablePipe]
})
export class NgxsDataUtilsModule {}
