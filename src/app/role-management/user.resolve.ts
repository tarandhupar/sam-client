import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { UserAccessService } from 'api-kit/access/access.service';

@Injectable()
export class UserResolve implements Resolve<any> {
  constructor(private api: UserAccessService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.api.getAllUserRoles(route.params.id);
  }
}
