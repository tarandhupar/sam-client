import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, NavigationExtras, Router, RouterStateSnapshot } from '@angular/router';
import { Cookie } from "ng2-cookies";
import { UserService } from "../../role-management/user.service";

import { merge } from 'lodash';

@Injectable()
export class IsLoggedInGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private user: UserService) {
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>|boolean {
    return this.canActivate(route, state);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>|boolean {
    const isLoggedIn = this.user.isLoggedIn();
    let options: NavigationExtras;

    if (!isLoggedIn) {
      options = {
        queryParams: merge({
          redirect: state.url.replace(/\?.+$/, '')
        }, state.root.queryParams)
      };

      this.router.navigate(['/signin'], options);
    }

    return isLoggedIn;
  }
}
