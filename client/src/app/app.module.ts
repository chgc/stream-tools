import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Route[] = [
  { path: 'caption', loadChildren: './caption/caption.module#CaptionModule' },
  { path: 'remote', loadChildren: './remote/remote.module#RemoteModule' },
  { path: '**', redirectTo: '/remote', pathMatch: 'full' }
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(routes), FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
