import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule, Route } from '@angular/router';
import { DisplayComponent } from './display/display.component';
import { GuestComponent } from './guest/guest.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Route[] = [
  { path: 'display', component: DisplayComponent },
  { path: 'guest', component: GuestComponent },
  { path: '**', redirectTo: '/guest', pathMatch: 'full' }
];

@NgModule({
  declarations: [AppComponent, DisplayComponent, GuestComponent],
  imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(routes), FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
