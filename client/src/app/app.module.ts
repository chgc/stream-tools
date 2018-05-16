import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './main/login/login.component';
import { MainModule } from './main/main.module';

const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    canActivateChild: [AuthGuard],
    children: [
      { path: 'caption', loadChildren: './caption/caption.module#CaptionModule' },
      { path: 'remote', loadChildren: './remote/remote.module#RemoteModule' }
    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    NgxsModule.forRoot([]),
    AngularFireAuthModule,
    MainModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
