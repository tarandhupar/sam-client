import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { UserAccessService } from "../../api-kit/access/access.service";
import { UserAccessMock } from "../../api-kit/access/access.service.mock";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AlertFooterService } from "../app-components/alert-footer/alert-footer.service";

@Injectable()
export class RoleCategoriesResolve implements Resolve<any> {
  constructor(
    private accessService: UserAccessService,
    private footerAlerts: AlertFooterService
  )
  {

  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.accessService.getDomainCategoriesAndRoles()
      .catch(() => {
        this.footerAlerts.registerFooterAlert({
          description: "There was an error with a required service.",
          type: 'error',
          timer: 3200,
        });
        return Observable.throw('Error while fetching access request.');
      });
  }
}
