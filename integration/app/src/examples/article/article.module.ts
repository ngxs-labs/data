import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { ArticleComponent } from './article.component';
import { ArticleEntitiesState } from './article-entities.state';
import { ArticleDialogComponent } from './dialog/article-dialog.component';

@NgModule({
    declarations: [ArticleComponent, ArticleDialogComponent],
    entryComponents: [ArticleDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatTableModule,
        MatInputModule,
        MatIconModule,
        NgxsModule.forFeature([ArticleEntitiesState]),
        RouterModule.forChild([{ path: '', component: ArticleComponent }]),
        MatSortModule
    ]
})
export class ArticleModule {}
