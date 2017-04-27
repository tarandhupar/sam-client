import { IAMService } from 'api-kit';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class RegisterGuard implements CanActivate, CanActivateChild {
  private api;

  private states = {
    local: false,
    route: '/',
    params: {},
    query: {}
  };

  constructor(private router: Router, private _api: IAMService) {
    this.api = _api.iam;
    this.states.local = this.api.isLocal();
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
