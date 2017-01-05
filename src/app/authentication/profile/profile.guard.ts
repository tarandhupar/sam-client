import { IAMService } from 'api-kit';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class ProfileGuard implements CanActivate, CanActivateChild {
  private api;

  private states = {
    route: '/',
    params: {},
    query: {}
  };

  constructor(private router: Router, private cookies: CookieService, private _api: IAMService) {
    this.api = _api.iam;
console.log(this);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url = state.url;

    this.states.route = this.router.url;
    this.states.params = route.params;
    this.states.query = route.queryParams;

    return this.verifyRoute();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  verifyRoute() {
    return true;
  }
}
