import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ArticleService} from '../controller/service/article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
