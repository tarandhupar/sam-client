import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

import { FHService } from 'api-kit/fh/fh.service';

@Injectable()
export class OrgDetailResolve implements Resolve<any> {
  constructor(private api: FHService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.api.getOrganizationView(route.params['orgId']).map(data => {return data; });
  }
}
