import { IDomain } from "../../api-kit/access/domain.interface";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserAccessService } from "../../api-kit/access/access.service";
import { Injectable } from "@angular/core";

@Injectable()
export class DomainsResolve implements Resolve<IDomain> {
  constructor(private accessService: UserAccessService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.accessService.getDomains();
  }
}
