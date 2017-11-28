import { Injectable  } from '@angular/core';
import { IAMService } from 'api-kit';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class SystemGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private api: IAMService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(!(this.api.iam.user.isSystemAccount() || this.api.iam.user.isSecurityApprover())) {
      return this.toWorkspace();
    }

    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url.replace(/\?.+$/, '');

    switch(url) {
      case '/workspace/system/profile':
      case '/workspace/system/password':
      case '/workspace/system/migrations':
        if(!this.api.iam.user.isSystemAccount()) {
          return this.toWorkspace();
        }

        break;

      case '/workspace/system':
      case '/workspace/system/new':
      case '/workspace/system/status':
        if(!(this.api.iam.user.isSystemAccount() || this.api.iam.user.isSecurityApprover())) {
          return this.toWorkspace();
        }

        break;
    }

    return true;
  }

  toWorkspace() {
    this.router.navigate(['/workspace']);
    return false;
  }
}
