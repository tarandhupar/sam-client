import { IAMService } from "api-kit/iam/iam.service";
import { Injectable, NgZone } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Cookie } from "ng2-cookies";
import { FORBIDDEN_PAGE_PATH } from "./403.route";

@Injectable()
export class AdminOrDeptAdminGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (Cookie.get('adminLevel') === '0' || Cookie.get('adminLevel') === '1') {
      return true;
    } else {
      this.router.navigate([FORBIDDEN_PAGE_PATH]);
      return false;
    }
  }
}


