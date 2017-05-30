import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { UserAccessService } from "../../api-kit/access/access.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class DomainDefinitionResolve implements Resolve<any> {
  constructor(private accessService: UserAccessService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.accessService.getRoleObjDefinitions('role', '').catch(() => {
      console.error('unable to retrieve roles for domains');
      return Observable.of([]);
    });
  }
}
