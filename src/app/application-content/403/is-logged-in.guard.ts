import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';
import { Cookie } from "ng2-cookies";
import { UserService } from "../../users/user.service";

@Injectable()
export class IsLoggedInGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private user: UserService) {
  }

  canActivateChild(route: ActivatedRouteSnapshot): Promise<boolean>|boolean {
    return this.canActivate(route);
  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean>|boolean {
    const isLoggedIn = this.user.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/signin']);
    }
    return isLoggedIn;
  }
}
