import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Resolve } from '@angular/router';
import { Cookie } from "ng2-cookies";
import {IAMService} from "api-kit/iam/iam.service";

@Injectable()
export class UserNameResolve implements Resolve<string> {
  private iam;
  constructor(
    private router: Router,
    _iam: IAMService
  ) {
    this.iam = _iam.iam;
  }

  resolve(route: ActivatedRouteSnapshot): string {
    let cookie = Cookie.get('IAMSession');
    if (cookie) {
      let u = Cookie.get('IAMSession');
      let uo;
      uo = JSON.parse(u);
      return uo.uid;
    } else {
      return '';
    }
  }
}
