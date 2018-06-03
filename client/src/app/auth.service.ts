import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { firebase } from '@firebase/app';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState = this.afAuth.authState;
  idToken;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.idToken.subscribe(token => {
      this.idToken = token;
    });
  }

  signInWithSocial(loginProvider: 'google' | 'github') {
    let provider;
    switch (loginProvider) {
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider();
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

  signOut() {
    return this.afAuth.auth
      .signOut()
      .then(() => this.router.navigate(['/login']));
  }
}
