import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from "rxjs";
import { FeatureToggleService } from "../../../api-kit/feature-toggle/feature-toggle.service";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";

/*
 Usage: Add the FeatureToggleGuard to the route, when feature toggle for the page is needed. It will make feature toggle api call to decide whether hide the page for current environment or not.
 Please define the 'featureToggleKey' in the routes to enable this guard, in order to use that for checking feature toggle result from api
 export const routes: Routes = [{
 path: 'profile',
 canActivate: [ FeatureToggleGuard ],
 }]

 */
@Injectable()
export class FeatureToggleGuard implements CanActivateChild, CanActivate {

  constructor(
    private featureToggleService: FeatureToggleService,
    private router: Router,
    private alertFooter: AlertFooterService
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.canActivateChild(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    let toggleKey = route.data['featureToggleKey'];
    if (!toggleKey) {
      throw new Error('Must define a toggle feature key property for this route');
    }

    return this.featureToggleService.checkFeatureToggle(toggleKey)
      .map(
        res => {
          return res;
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
