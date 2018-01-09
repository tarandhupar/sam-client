import * as Cookies from 'js-cookie';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate} from "@angular/router";
import {Injectable, Input} from '@angular/core';
import {Observable} from "rxjs";
import {WageDeterminationService} from "../../../../api-kit";
import {CBAFormViewModel} from "../../operations/framework/data-model/form/cba-form.model";

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
@Injectable()
export class CBAAuthGuard implements CanActivate, CanDeactivate<CanComponentDeactivate> {
  @Input() viewModel: CBAFormViewModel;
  location: any;
  _cbaLinks: any;
  restrictedUrl = ['/403'];
  pageNotFoundUrl = ['/404'];
  unauthorizedUrl = ['/401'];
  constructor(private router: Router, private service: WageDeterminationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (CBAAuthGuard.hasCookie()) {
      return this.service.getCBAPermissions().map((res: any) => {
        //Feature Toggle case and managing other cases depending on user permission
        if (res._links != null) {
          this._cbaLinks = res;
          return true;
        }
        this.router.navigate(this.restrictedUrl);
        return false;
      }).catch( err  => {
        if (err && err.status === 401) {
          this.router.navigate(this.restrictedUrl);
        }  if (err && err.status === 404) {
          this.router.navigate(this.pageNotFoundUrl);
        }
        return Observable.of(false);
      });
    } else {
      this.router.navigate(this.unauthorizedUrl);
      return false;
    }
  }

  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

  static hasCookie() : boolean {
    return !!Cookies.get('iPlanetDirectoryPro');
  }

  checkPermissions(cba: any) {
    this.viewModel = new CBAFormViewModel(cba);
    let isRestricted: boolean = false;
    let url;
    if (this.router.url.indexOf('/add') >= 0) {
      if (this._cbaLinks && this._cbaLinks._links && !this._cbaLinks._links['cba:create']) {
        isRestricted = true;
      } else if (!this.viewModel) {
        url = '/wage-determination/cba/add';
        this.router.navigateByUrl(url);
      }
    } else if (this.router.url.indexOf('/edit') >= 0) {
      if (this._cbaLinks && this._cbaLinks._links && !this._cbaLinks._links['cba:update']) {
        isRestricted = true;
      } else if (!this.viewModel.isNew) {
        url = '/wage-determination/cba/' + this.viewModel.cbaId + '/edit';
        this.router.navigateByUrl(url);
      }
    }
    if (isRestricted) {
      this.router.navigate(this.restrictedUrl);
    }
    return !isRestricted;
  }
}

