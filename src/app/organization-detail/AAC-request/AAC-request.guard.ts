import { IAMService } from "api-kit/iam/iam.service";
import { Injectable, NgZone } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  NavigationExtras
} from '@angular/router';
import { Cookie } from 'ng2-cookies';
import {error} from "../../app-components/alert-header/alerts-test-data.spec";

@Injectable()
export class AACRequestGuard implements CanActivate {
  private api;

  private states = {
    route: '/',
    params: {},
    query: {}
  };

  isSignedIn = false;
  constructor(private router: Router, private zone: NgZone, private _api: IAMService) {
    this.api = _api.iam;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url = state.url;

    this.states.route = state.url;
    this.states.params = route.params;
    this.states.query = route.queryParams;

    return this.verifyRoute();
  }

  verifyRoute() {
    this.api.checkSession(
      (user) => {
        this.zone.run(() => {
          this.isSignedIn = true;
        });
      },
      () => {
        let navigationExtras: NavigationExtras = {
          queryParams: { redirect:this.states.route },
        };
        this.router.navigate(['/signin'],navigationExtras);
      }
    );
    return true;
  }

}


