import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

import { FHService } from 'api-kit/fh/fh.service';

@Injectable()
export class CreateOrgResolve implements Resolve<any> {
  constructor(private api: FHService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    let orgId: string;
    if (route.queryParams.orgId) {
        orgId = '' + route.queryParams.orgId;
        return this.api.getOrganizationById(orgId, false).map(data => {return data._embedded[0].org});
    }
    return Observable.of(null);
  }
}
