import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SystemAlertsService } from 'api-kit';

@Injectable()
export class AlertsResolver implements Resolve<any> {
  constructor(private systemAlertsService: SystemAlertsService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.systemAlertsService.getAll().catch((err, caught) => {
      this.router.navigate(['error']);
      return Observable.of(err);
    });
  }
}
