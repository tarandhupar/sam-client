import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from "rxjs";
import { FHService } from "api-kit/fh/fh.service";
import { AlertFooterService } from "../app-components/alert-footer/alert-footer.service";

/*
 Usage: Add the FHAccessGuard to the route. Need OrgId as route params defined, and use this guard to protect the route:
 export const routes: Routes = [{
 path: 'profile',
 canActivate: [ FHAccessGuard ],
 }]

 */
@Injectable()
export class FHAccessGuard implements CanActivateChild, CanActivate {

  constructor(
    private accessService: FHService,
    private router: Router,
    private alertFooter: AlertFooterService
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.canActivateChild(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {

    let orgId = route.parent.params['orgId'];
    return this.accessService.getAccess(orgId, false)
      .map(
        res => {
          return true;
        }
      )
      .catch(
        error => {
          let status = error.status;
          if (status === 401) {
            this.router.navigate(['/signin'], {queryParams: {redirect: this.router.url}});
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
        }
      );
  }
}


