import { IAMService } from "api-kit/iam/iam.service";
import { Injectable, NgZone } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {error} from "../../alerts/alerts-test-data.spec";

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
        this.router.navigate(['/signin']);
      }
    );
    return true;
  }

}


