// import { Injectable } from '@angular/core';
// import {Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute} from '@angular/router';
// import { Observable } from 'rxjs/Rx';
// import { SystemAlertsService } from 'api-kit';
// import {ERROR_PAGE_PATH} from "../application-content/error/error.route";
// import {ALERTS_PER_PAGE} from "./alerts.page";
//
// @Injectable()
// export class AlertsResolver implements Resolve<any> {
//   constructor(private systemAlertsService: SystemAlertsService, private router: Router) { }
//
//   resolve(route: ActivatedRouteSnapshot): Observable<any> {
//     let params = route.queryParams;
//
//     let page = params['page'];
//     let offset = 0;
//     if (page) {
//       offset = parseInt(page) * ALERTS_PER_PAGE;
//     }
//
//     let statuses = params['statuses'];
//     if (statuses) {
//       statuses = statuses.split(',');
//     }
//
//     let types = params['types'];
//     if (types) {
//       types = types.split(',');
//     }
//
//     let sort = params['sort'];
//     let datePublished = params['date_published'];
//
//     return this.systemAlertsService.get(ALERTS_PER_PAGE, offset, statuses, types, datePublished, sort).catch((err, caught) => {
//       this.router.navigate([ERROR_PAGE_PATH]);
//       return Observable.of(err);
//     });
//   }
// }
