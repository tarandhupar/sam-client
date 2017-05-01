import { Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute } from "@angular/router";
import { UserAccessService } from "../../api-kit/access/access.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";

@Injectable()
export class RequestAccessResolve implements Resolve<any> {
  constructor(
    private accessService: UserAccessService,
    private footerAlerts: AlertFooterService
  )
  {

  }

  resolve(route: ActivatedRouteSnapshot) {
    let rid = route.queryParams['request'];

    if (!rid) {
      return Observable.of(null);
    }

    return this.accessService.getPendingRequestById(rid)
      .catch(() => {
        this.footerAlerts.registerFooterAlert({
          description: "The request ID was not found or there was an error with a required service.",
          type: 'error',
          timer: 3200,
        });
        return Observable.throw('Error while fetching access request.');
      });
  }
}
