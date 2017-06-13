import { Injectable } from '@angular/core';
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
  private states = {
    parent: '',
    route: '/',
    params: {},
    query: {},
    data: {}
  };

  constructor(private router: Router, private api: IAMService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url = state.url;

    this.states.route = state.url;
    this.states.params = route.params;
    this.states.query = route.queryParams;

    if(route.url[0] && route.url[0].path) {
      this.states.parent = route.url[0].path;
    }

    return this.verifyRoute();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  verifyRoute(): boolean {
    let canActivate = true;

    switch(this.states.parent) {
      case 'signout':
        canActivate = this.signout();
        break;
    }

    return canActivate;
  }

  signout() {
    this.api.iam.logout(false);
    this.router.navigate(['/signin']);
    return false;
  }
}
