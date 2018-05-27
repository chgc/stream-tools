import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './main/login/login.component';
import { MainModule } from './main/main.module';
import { MainComponent } from './main/main/main.component';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    canActivateChild: [AuthGuard],
    component: MainComponent,
    children: [
      {
        path: 'caption',
        loadChildren: './caption/caption.module#CaptionModule'
      },
      { path: 'remote', loadChildren: './remote/remote.module#RemoteModule' }
    ]
  },
  { path: '**', redirectTo: '/main/remote', pathMatch: 'full' }
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
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MainModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
