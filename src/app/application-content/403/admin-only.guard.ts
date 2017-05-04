import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Cookie } from "ng2-cookies";
import { FORBIDDEN_PAGE_PATH } from "./403.route";

@Injectable()
export class AdminOnlyGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (Cookie.get('adminLevel') !== '0') {
      this.router.navigate([FORBIDDEN_PAGE_PATH]);
      return false;
    } else {
      return true;
    }

  }
}


