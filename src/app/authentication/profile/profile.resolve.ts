import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class ProfileResolve implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot) {
    let routeName = '/',
        permissions = {};
    return permissions;
  }
}
