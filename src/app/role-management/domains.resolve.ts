import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { UserAccessService } from "api-kit/access/access.service";
import { IDomain } from "api-kit/access/domain.interface";

@Injectable()
export class DomainsResolve implements Resolve<IDomain> {
  constructor(private accessService: UserAccessService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.accessService.getDomains();
  }
}
