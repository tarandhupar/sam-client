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
export class SecurityGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private api: IAMService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.verifyRoute();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  verifyRoute() {
    if(!this.api.iam.user.isSecurityApprover()) {
      this.router.navigate(['/workspace']);
      return false;
    }

    return true;
  }
}
