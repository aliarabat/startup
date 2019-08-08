import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Article} from '../model/article.model';
import {Subject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private _articles: Article[] = [];
  articlesChanged = new Subject<Article[]>();
  private aricticlesSubscrptions: Subscription[] = [];

  constructor(private http: HttpClient) {
  }

  createArticle(article: Article) {
    const headers = new HttpHeaders({
      'X-API-KEY': '123456'
    });
    this.aricticlesSubscrptions.push(this.http.post<any>('http://localhost/codeigniter-restserver/articles/index_create', JSON.stringify([article])).subscribe((response) => {
      response === 'CREATED' ? this.fetchArticles() : null;
    }));
  }

  fetchArticles() {
    this.aricticlesSubscrptions.push(this.http.get<Article[]>('http://localhost/codeigniter-restserver/articles/index_retrieve').subscribe((data: Article[]) => {
      if (data != null) {
        this._articles = data;
        this.articlesChanged.next([...data]);
      }
    }));
  }

  deleteArticle(id: number) {
    this.aricticlesSubscrptions.push(this.http.get<any>('http://localhost/codeigniter-restserver/articles/index_sweep/' + id).subscribe((response) => {
      console.log(response);
      if (response.status === 'DELETED') {
        //this._articles = this._articles.filter((article: Article) => article.id !== id);
        const articleIndex = this._articles.findIndex((article) => article.id === id);
        if (articleIndex !== -1) {
          this._articles.splice(articleIndex, 1);
          this.articlesChanged.next([...this._articles]);
        }
      } else {
        console.log('Not deleted');
      }
    }));
  }

  updateArticle(res: any) {
    console.log(res);
    this.aricticlesSubscrptions.push(this.http.post<any>('http://localhost/codeigniter-restserver/articles/index_update', JSON.stringify(res)).subscribe((response) => {
        if (response === 'UPDATED') {
          console.log('updated');
          this._articles.map((article) => {
            if (article.id === res.id) {
              article.title = res.title;
              article.description = res.description;
            }
          });
        }
      })
    );
  }

  getArticles() {
    return {...this._articles};
  }

}
