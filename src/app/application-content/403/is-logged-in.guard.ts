import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';
import { Cookie } from "ng2-cookies";
import { IAMService } from "api-kit/iam/iam.service";

@Injectable()
export class IsLoggedInGuard implements CanActivate, CanActivateChild {
  private iam;

  constructor(private router: Router, _iam: IAMService) {
    this.iam = _iam.iam;
  }

  canActivateChild(route: ActivatedRouteSnapshot): Promise<boolean>|boolean {
    return this.canActivate(route);
  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean>|boolean {
    if(!this.iam.user.isSignedIn()) {
      this.router.navigate(['/signin']);
      return false;
    }

    return true;
  }
}
