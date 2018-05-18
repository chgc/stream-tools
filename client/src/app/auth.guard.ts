import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (state.url.includes('display')) {
      return of(true);
    }
    return this.authService.authState.pipe(
      map(user => {
        const isLogin = user !== null;
        if (!isLogin) {
          this.router.navigate(['/login']);
        }
        return isLogin;
      })
    );
  }
}
