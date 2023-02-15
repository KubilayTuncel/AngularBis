import { Component, Injector, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';
import { createCustomElement } from '@angular/elements';
import { AlertComponent } from './alert.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  posts: Post[] = [];
  content=null

  constructor(private http: HttpClient,
              injector:Injector,
              domSanitizer:DomSanitizer) {

    const AlertElement = createCustomElement(AlertComponent, {injector:injector});
    customElements.define('my-alert',AlertElement);

    setTimeout(()=>{
      this.content=domSanitizer.bypassSecurityTrustHtml("<my-alert message='Rendered dynamically!'></my-alert>")
    },1000)
  }

  ngOnInit() {
    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts')
      .subscribe(fetchedPosts => (this.posts = fetchedPosts));
  }
}
