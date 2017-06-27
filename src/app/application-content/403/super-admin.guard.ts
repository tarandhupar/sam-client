import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Cookie } from "ng2-cookies";
import { AdminService } from "./admin.service";
import { AdminLevelService } from "./admin-level.service";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { Observable } from "rxjs";

@Injectable()
export class SuperAdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private adminLevelService: AdminLevelService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.adminLevelService.getLevel().map(level => {
      let b = level === 0;
      if (!b) {
        this.router.navigate(['/403'])
      }
      return b;
    });
  }
}


