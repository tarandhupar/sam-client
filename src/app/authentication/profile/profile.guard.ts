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
export class ProfileGuard implements CanActivate, CanActivateChild {
  private api;

  private states = {
    route: '/',
    params: {},
    query: {}
  };

  constructor(private router: Router, private zone: NgZone, private _api: IAMService) {
    this.api = _api.iam;
  }

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
    switch(this.states.route) {
      case '/signout':
        this.signout();
        break;
    }

    return true;
  }

  signout() {
    this.api.logout(false);
    this.router.navigate(['/signin']);
  }
}
