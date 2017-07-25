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
    return this.accessService.checkAccess(pageName).map(res => {
      if (res.status >= 200 && res.status < 300) {
        return true
      } else if (res.status === 401) {
        this.router.navigate(['/401']);
        return false;
      } else if (res.status === 403) {
        this.router.navigate(['/403']);
        return false;
      } else {
        this.alertFooter.registerFooterAlert({
          title: "",
          description: "You may not have the neccessary permission to perform this action.",
          type: 'error',
          timer: 3200
        });
        return false;
      }
    });
  }
}


