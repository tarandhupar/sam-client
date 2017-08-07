import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from "rxjs";
import { UserAccessService } from "api-kit/access/access.service";
import {AlertFooterService} from "../../alerts/alert-footer/alert-footer.service";

/*
 Usage: Add the CheckAccessGuard to the route. Define a property "pageName" as a data property on the route
 Example:

  export const routes: Routes = [{
     path: 'profile',
     data: { pageName: 'profile },
     canActivate: [ CheckAccessGuard ],
  }]

 */

@Injectable()
export class CheckAccessGuard implements CanActivateChild, CanActivate {

  constructor(
    private accessService: UserAccessService,
    private router: Router,
    private alertFooter: AlertFooterService,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.canActivateChild(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    let pageName = route.data['pageName'];
    if (!pageName) {
      throw new Error('Must define a pageName data property for this route');
    }
    return this.accessService.checkAccess(pageName)
      .map(res => {
        if (res.status >= 200 && res.status < 300) {
          return true;
        }
        return false;
      })
      .catch(res => {
        let body;
        try {
          body = res.json();
        } catch(e) {
          return Observable.of(false);
        }
        // if the server does not include the appropriate CORS headers, we cannot read res.status, so we have to get
        // status from the body
        let status = res.status || body.status;

        if (!status) {
          return Observable.of(false);
        }
        if (status === 401) {
          this.router.navigate(['/signin']);
          this.alertFooter.registerFooterAlert({
            title: "",
            description: "You must be logged in to perform his action.",
            type: 'error',
            timer: 3200
          });
          return Observable.of(false);
        } else if (status === 403) {
          this.router.navigate(['/403']);
          return Observable.of(false);
        } else {
          this.alertFooter.registerFooterAlert({
            title: "",
            description: "You may not have the neccessary permission to perform this action.",
            type: 'error',
            timer: 3200
          });
          return Observable.of(false);
        }
      });
  }
}


