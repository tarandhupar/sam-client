import { Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute } from "@angular/router";
import { UserAccessService } from "../../api-kit/access/access.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";

@Injectable()
export class RequestAccessResolve implements Resolve<any> {
  constructor(
    private accessService: UserAccessService,
    private router: Router,
    private footerAlerts: AlertFooterService,
    private route: ActivatedRoute
  )
  {

  }

  resolve(route: ActivatedRouteSnapshot) {
    let rid = this.route.params['requestId'];

    return this.accessService.getPendingRequestById(rid).catch(() => {
      this.router.navigateByUrl('/role-workspace');
      this.footerAlerts.registerFooterAlert({
        description: "There was an error with a required service",
        type: 'error',
      });
      return Observable.throw('Error while fetching access request.');
    });
  }
}
