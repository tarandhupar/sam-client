import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertFooterService } from '../app-components/alert-footer/alert-footer.service';
import { ContentManagementService } from '../../api-kit';

@Injectable()
export class CmAccessGuard implements CanActivateChild, CanActivate {

  constructor(
    private router: Router,
    private alertFooter: AlertFooterService,
    private cmService: ContentManagementService,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.canActivateChild(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    let privelege = route.data['privelege'];

    if (!privelege) {
      throw new Error('Must define a "privelege" property for this route');
    }

    return this.cmService.checkAccess()
      .map(res => res.json())
      .map(priveleges => {
        const allowed = !!priveleges[privelege];
        if (!allowed) {
          this._showProhibitedMessage();
          this._redirectToHome();
          return false;
        }
        return true;
      })
      .catch(err => {
        if (err && err.status === 401) {
          console.error('Access prohibited');
          this._showProhibitedMessage();
          this._redirectToHome();
          return Observable.of(false);
        }
        console.error('Unable to determine privelege level');
        this._showErrorMessage();
        this._redirectToHome();
        return Observable.of(false);
      });
  }

  _showProhibitedMessage() {
    this.alertFooter.registerFooterAlert({
      title: '',
      description: 'You do not have the neccessary permissions to perform this action.',
      type: 'error',
      timer: 5200
    });
  }

  _showErrorMessage() {
    this.alertFooter.registerFooterAlert({
      title: '',
      description: 'Service unavailable.',
      type: 'error',
      timer: 5200
    });
  }

  _redirectToHome() {
    this.router.navigate(['']);
  }
}


