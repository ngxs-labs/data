import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { uuidv4 } from '../../utils/uuidv4';
import { ArticleEntitiesState } from './article-entities.state';
import { Article } from './article.interface';
import { ArticleDialogComponent } from './dialog/article-dialog.component';

@Component({
    selector: 'article',
    templateUrl: './article.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent {
    constructor(public dialog: MatDialog, public articleEntities: ArticleEntitiesState) {}

    public createArticle(): void {
        this.ensureDialog({ uid: uuidv4(), title: '', category: '' }).subscribe((article: Article): void =>
            this.articleEntities.addOne(article)
        );
    }

    public editById(id: string): void {
        this.ensureDialog(this.articleEntities.selectOne(id)!).subscribe((article: Article): void =>
            this.articleEntities.updateOne({ id, changes: article })
        );
    }

    public deleteById(id: string): void {
        this.articleEntities.removeOne(id);
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
