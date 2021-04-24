import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { generateUid } from '../../utils/generate-uid';
import { Article } from './article.interface';
import { ArticleEntitiesState } from './article-entities.state';
import { ArticleDialogComponent } from './dialog/article-dialog.component';

@Component({
    selector: 'article',
    templateUrl: './article.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent {
    constructor(public dialog: MatDialog, public articleEntities: ArticleEntitiesState) {}

    public createArticle(): void {
        this.ensureDialog({ uid: generateUid(), title: '', category: '' }).subscribe((article: Article): void =>
            this.articleEntities.addOne(article)
        );
    }

    public editById(id: string): void {
        const entity: Article = this.articleEntities.selectOne(id)!;
        this.ensureDialog(entity).subscribe((article: Article): void =>
            this.articleEntities.updateOne({ id, changes: article })
        );
    }

    public deleteById(id: string): void {
        this.articleEntities.removeOne(id);
    }

    public sortData(event: Sort): void {
        this.articleEntities.sort({ sortBy: event.active as keyof Article, sortByOrder: event.direction });
    }

    private ensureDialog(entity: Article): Observable<Article> {
        return this.dialog
            .open<ArticleDialogComponent, Article>(ArticleDialogComponent, {
                width: '300px',
                disableClose: true,
                data: entity
            })
            .afterClosed()
            .pipe(filter((article: Article): boolean => !!article));
    }
}
