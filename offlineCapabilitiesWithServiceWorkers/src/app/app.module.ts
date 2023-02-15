import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PostComponent } from './post/post.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UserComponent } from './user/user.component'; //bunu eklemek icin ng add @angular/pwa kodunu terminalde yazdik.
import { AlertComponent } from './alert.component';

@NgModule({
  declarations: [AppComponent, PostComponent, UserComponent, AlertComponent],
  imports: [BrowserModule, HttpClientModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AlertComponent]
})
export class AppModule {}
