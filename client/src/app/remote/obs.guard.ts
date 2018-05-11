import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { ObsService } from './obs.service';

@Injectable()
export class ObsGuard implements CanActivateChild {
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const canActivate = !!this.obsService.websocket$ && !this.obsService.websocket$.isStopped;
    if (!canActivate) {
      this.router.navigate(['./remote']);
    }
    return canActivate;
  }
  constructor(private obsService: ObsService, private router: Router) {}
}
