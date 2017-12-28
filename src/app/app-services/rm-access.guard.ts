import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserAccessService } from 'api-kit/access/access.service';
import { AlertFooterService } from '../app-components/alert-footer/alert-footer.service';

import adminLevel from '../role-management/admin-level';

/*
 Usage: Add the RmAccessGuard to the route. Define a property "pageName" as a data property on the route
 Example:

  export const routes: Routes = [{
     path: 'profile',
     data: { pageName: 'profile },
     canActivate: [ RmAccessGuard ],
  }]

 */
@Injectable()
export class RmAccessGuard implements CanActivateChild, CanActivate {
  constructor(
    private accessService: UserAccessService,
    private router: Router,
    private alertFooter: AlertFooterService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.canActivateChild(route);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | boolean {
    let pageName = route.data['pageName'];
    let userId = route.params['id'];
    let requestId = route.params['requestId'];

    if (!pageName) {
      throw new Error('Must define a pageName data property for this route');
    }
    return this.accessService
      .checkAccess(pageName, userId, requestId)
      .map(res => {
        adminLevel.showAllDepartments = false;
        if (res.status >= 200 && res.status < 300) {
          let body;
          try {
            body = res.json();
            if (body) {
              if (typeof body.showAllDepartments === 'boolean')
                adminLevel.showAllDepartments = body.showAllDepartments;
              if (typeof body.isGov === 'boolean')
                adminLevel.isGov = body.isGov;
            }
          } catch (e) {
            return false;
          }
          return true;
        }
        return false;
      })
      .catch(res => {
        let body;
        try {
          body = res.json();
        } catch (e) {
          return Observable.of(false);
        }

        // if the server does not include the appropriate CORS headers, we cannot read res.status, so we have to get
        // status from the body
        let status = res.status || body.status;

        if (!status) {
          return Observable.of(false);
        }
        if (status === 401) {
          this.router.navigate(['/signin'], {
            queryParams: { redirect: this.router.url }
          });
          this.alertFooter.registerFooterAlert({
            title: '',
            description: 'You must be logged in to perform this action.',
            type: 'error',
            timer: 3200
          });
          return Observable.of(false);
        } else if (status === 403) {
          this.router.navigate(['/403']);
          return Observable.of(false);
        } else if (status === 404) {
          this.router.navigate(['/404']);
          return Observable.of(false);
        } else {
          this.alertFooter.registerFooterAlert({
            title: '',
            description:
              'You may not have the neccessary permission to perform this action.',
            type: 'error',
            timer: 3200
          });
          return Observable.of(false);
        }
      });
  }
}
