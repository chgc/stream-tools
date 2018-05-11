import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DisplayComponent } from './display/display.component';
import { GuestComponent } from './guest/guest.component';

const routes: Route[] = [
  { path: 'display', component: DisplayComponent },
  { path: 'guest', component: GuestComponent },
  { path: 'remote', loadChildren: './remote/remote.module#RemoteModule' },
  { path: '**', redirectTo: '/remote', pathMatch: 'full' }
];

@NgModule({
  declarations: [AppComponent, DisplayComponent, GuestComponent],
  imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(routes), FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
