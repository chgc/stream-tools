import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { firebase } from '@firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState = this.afAuth.authState;
  constructor(public afAuth: AngularFireAuth, private router: Router) {}

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
    if (provider) {
      this.afAuth.auth.signInWithPopup(provider).then(this.redirectToPopup());
    }
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['/login']));
  }
  private redirectToPopup() {
    return () => this.router.navigate(['/remote']);
  }
}
