import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SystemAlertsService } from 'api-kit';
import {ERROR_PAGE_PATH} from "../application-content/error/error.route";

@Injectable()
export class AlertsResolver implements Resolve<any> {
  constructor(private systemAlertsService: SystemAlertsService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let params = route.queryParams;
    let limit = params['limit'];
    let offset = params['offset'];
    let statuses = params['statuses'];
    let types = params['types'];
    let datePublished = params['date_published'];
    return this.systemAlertsService.get(limit, offset, statuses, types, datePublished).catch((err, caught) => {
      this.router.navigate([ERROR_PAGE_PATH]);
      return Observable.of(err);
    });
  }
}
