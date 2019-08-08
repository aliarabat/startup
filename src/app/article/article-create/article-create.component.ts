import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ArticleService} from '../../controller/service/article.service';

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent implements OnInit {

  constructor(private articleService:ArticleService) { }

  ngOnInit() {
  }

  onSumbit(f: NgForm) {
    this.articleService.createArticle({title: f.value.title, description: f.value.description});
    f.onReset();
  }
}
