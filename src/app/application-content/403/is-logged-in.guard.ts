import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, NavigationExtras, Router, RouterStateSnapshot } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { UserService } from '../../role-management/user.service';
import { IAMService } from 'api-kit';

import { merge } from 'lodash';

@Injectable()
export class IsLoggedInGuard implements CanActivate, CanActivateChild {
  private route = '';

  constructor(private router: Router, private api: IAMService, private user: UserService) {}

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

    if(route.url[0] && route.url[0].path) {
      this.route = route.url[0].path;
    }

    switch(this.route) {
      case 'signout':
        return this.signout();

      default:
        return isLoggedIn;
    }
  }

  signout() {
    this.api.iam.logout(false, () => {
      this.router.navigate(['/signin']);
    });

    return false;
  }
}
