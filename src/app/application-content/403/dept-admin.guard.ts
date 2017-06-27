import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router} from '@angular/router';
import { AdminLevelService } from "./admin-level.service";
import { Observable } from "rxjs";

@Injectable()
export class DeptAdminGuard implements CanActivateChild, CanActivate {

  constructor(
    private adminLevelService: AdminLevelService,
    private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.canActivateChild(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.adminLevelService.getLevel().map(level => {
      let b = level < 2;
      if (!b) {
        this.router.navigate(['/403'])
      }
      return b;
    });
  }
}


