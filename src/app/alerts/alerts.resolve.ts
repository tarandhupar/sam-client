import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SystemAlertsService } from 'api-kit';
import {ERROR_PAGE_PATH} from "../application-content/error/error.route";

@Injectable()
export class AlertsResolver implements Resolve<any> {
  constructor(private systemAlertsService: SystemAlertsService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.systemAlertsService.get().catch((err, caught) => {
      this.router.navigate([ERROR_PAGE_PATH]);
      return Observable.of(err);
    });
  }
}
