import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AdminLevelService } from "./admin-level.service";
import { Observable } from "rxjs";

@Injectable()
export class AdminLevelResolve implements Resolve<number> {

  constructor(private adminLevelService: AdminLevelService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<number> {
    return this.adminLevelService.getLevel();
  }
}
