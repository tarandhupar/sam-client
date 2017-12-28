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
export class RegistrationGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private api: IAMService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.verifyRoute();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.verifyRoute();
  }

  verifyRoute(): boolean {
    if(this.api.iam.user.isSignedIn() && !this.api.iam.isDebug()) {
      this.router.navigate(['/workspace']);
      return false;
    }

    return true;
  }
}
