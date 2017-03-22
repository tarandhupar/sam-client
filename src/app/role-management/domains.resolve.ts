import { IDomain } from "../../api-kit/access/domain.interface";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserAccessService } from "../../api-kit/access/access.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AlertFooterService } from "../alerts/alert-footer/alert-footer.service";

@Injectable()
export class DomainsResolve implements Resolve<IDomain> {
  constructor(private accessService: UserAccessService, private router: Router, private footerAlerts: AlertFooterService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.accessService.getDomains().catch(() => {
      this.router.navigateByUrl('/');
      this.footerAlerts.registerFooterAlert({
        description: "There was an error with an a required service",
        type: 'error',
      });
      return Observable.throw('Domain endpoint down.');
    });
  }
}
