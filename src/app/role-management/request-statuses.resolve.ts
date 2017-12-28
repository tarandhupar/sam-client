import { Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute } from "@angular/router";
import { UserAccessService } from "../../api-kit/access/access.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AlertFooterService } from "../app-components/alert-footer/alert-footer.service";

@Injectable()
export class RequestStatusNamesResolve implements Resolve<any[]> {
  constructor(
    private accessService: UserAccessService,
    private router: Router,
    private footerAlerts: AlertFooterService,
    private route: ActivatedRoute
  )
  {

  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.accessService.getRequestStatuses().catch(() => {
      this.router.navigateByUrl('/access/requests');
      this.footerAlerts.registerFooterAlert({
        description: "There was an error with a required service",
        type: 'error',
        timer: 3200,
      });
      return Observable.throw('Error while fetching status names.');
    });
  }
}
