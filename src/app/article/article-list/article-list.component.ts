import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Article} from '../../controller/model/article.model';
import {Subscription} from 'rxjs';
import {ArticleService} from '../../controller/service/article.service';
import {ArticleUpdateComponent} from '../article-update/article-update.component';
import {ArticleDeleteComponent} from '../article-delete/article-delete.component';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit, OnDestroy, AfterViewInit {


  dataSource = new MatTableDataSource<Article>();
  displayedColumns = ['id', 'title', 'description', 'actions'];
  articlesSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private articleService: ArticleService) {
  }

  ngOnInit() {
    this.articleService.fetchArticles();
    this.articlesSubscription = this.articleService.articlesChanged.subscribe((res) => {
      if (res != null) {
        this.dataSource.data = res;
      }
    });
  }

  deleteArticle(id: number) {
    const dialogRef = this.dialog.open(ArticleDeleteComponent);
    dialogRef.afterClosed().subscribe((response) => response ? this.articleService.deleteArticle(id) : null);
  }

  ngOnDestroy() {
    this.articlesSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  updateArticle(element: any) {
    const dialogRef = this.dialog.open(ArticleUpdateComponent, {
      data: {
        id: element.id,
        title: element.title,
        description: element.description
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => res ? this.articleService.updateArticle(res) : null);
  }
}
