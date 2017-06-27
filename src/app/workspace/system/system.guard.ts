import { Injectable, NgZone } from '@angular/core';
import { IAMService } from 'api-kit';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class SystemGuard implements CanActivate, CanActivateChild {
  private states = {
    route: '/',
    params: {},
    query: {}
  };

  constructor(private router: Router, private zone: NgZone, private api: IAMService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url = state.url;

    this.states.route = state.url;
    this.states.params = route.params;
    this.states.query = route.queryParams;

    return this.verifyRoute();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  verifyRoute() {
    if(!this.api.iam.user.isSystemAccount()) {
      this.router.navigate(['/workspace']);
      return false;
    }

    return true;
  }
}
