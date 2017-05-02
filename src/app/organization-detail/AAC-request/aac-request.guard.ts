import { IAMService } from "api-kit/iam/iam.service";
import { Injectable, NgZone } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class AACRequestGuard implements CanActivate {
  private api;

  private states = {
    local: false,
    route: '/',
    params: {},
    query: {}
  };
  isSignedIn:boolean = false;

  constructor(private router: Router, private iamService: IAMService, private zone: NgZone) {
    this.api = iamService.iam;
    this.states.local = this.api.isLocal();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url = state.url;

    this.states.route = this.router.url;
    this.states.params = route.params;
    this.states.query = route.queryParams;


    return this.checkSignInUser();
  }

  checkSignInUser() {
    //Get the sign in info
    this.isSignedIn = false;
    this.zone.runOutsideAngular(() => {
      this.iamService.iam.checkSession((user) => {
        this.zone.run(() => {
          this.isSignedIn = true;
        });
      });
    });

    if(!this.isSignedIn) this.router.navigateByUrl('/signin');
    return this.isSignedIn;
  }

}
