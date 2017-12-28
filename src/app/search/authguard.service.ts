import {Router, CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import * as Cookies from 'js-cookie';

@Injectable()
export class SearchAuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (Cookies.get('iPlanetDirectoryPro') === undefined) {
      this.router.navigate(['signin']);
    }
    return true;
  }

}
