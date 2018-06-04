import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditableGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(s => s.environement).pipe(
      map(env => env.uid),
      map(uid => !!uid),
      tap(hasUid => {
        if (!hasUid) {
          this.router.navigate(['/main/caption']);
        }
      })
    );
  }
}
