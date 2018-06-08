import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firebase } from '@firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { from, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState = this.afAuth.authState;
  idToken;
  accessToken$ = new BehaviorSubject('');

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private http: HttpClient
  ) {
    this.afAuth.idToken.subscribe(token => {
      this.idToken = token;
      if (token) {
        this.signUp().subscribe();
      }
    });
    this.cacheAccessToken();
  }

  cacheAccessToken() {
    if (localStorage.getItem('accessToken')) {
      this.accessToken$.next(localStorage.getItem('accessToken'));
    }
    this.accessToken$.subscribe(value => {
      localStorage.setItem('accessToken', value);
    });
  }

  signInWithSocial(loginProvider: 'google' | 'github') {
    let provider;
    switch (loginProvider) {
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider().addScope(
          'https://www.googleapis.com/auth/youtube'
        );
        break;
      case 'github':
        provider = new firebase.auth.GithubAuthProvider();
        break;
      default:
        provider = undefined;
        break;
    }
    return from(this.afAuth.auth.signInWithPopup(provider));
  }

  signUp() {
    return this.http.get('/api/Account/signup');
  }

  signOut() {
    return this.afAuth.auth.signOut().then(() => {
      this.accessToken$.next('');
      this.router.navigate(['/login']);
    });
  }
}
