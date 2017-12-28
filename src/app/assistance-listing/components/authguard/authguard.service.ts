import * as Cookies from 'js-cookie';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate} from "@angular/router";
import {Injectable, Input} from '@angular/core';
import {Observable} from "rxjs";
import {FALFormViewModel} from "../../assistance-listing-operations/fal-form.model";
import {FALFormErrorService} from "../../assistance-listing-operations/fal-form-error.service";
import {FALFormService} from "../../assistance-listing-operations/fal-form.service";

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
@Injectable()
export class FALAuthGuard implements CanActivate, CanDeactivate<CanComponentDeactivate> {
  @Input() viewModel: FALFormViewModel;
  location: any;
  _falLinks: any;
  restrictedUrl = ['/403'];
  pageNotFoundUrl = ['/404'];
  unauthorizedUrl = ['/401'];
  constructor(private router: Router, private errorService: FALFormErrorService, private service: FALFormService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.hasCookie()) {
      return this.service.getFALPermission().map((res: any) => {
        //Feature Toggle case and managing other cases depending on user permission
        if (res._links != null) {
          this._falLinks = res;
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
  hasCookie() {
    if (Cookies.get('iPlanetDirectoryPro') === undefined) {
      return false;
    }
    return true;
  }
  checkPermissions(screen: string, program: any) {
    this.viewModel = new FALFormViewModel(program);
    let isRestricted: boolean = false;
      let pathArray = this.router.url.split("/");
      let id = pathArray[2];
      switch (screen) {
        case 'submit':
          if (program && program._links && !program._links['program:submit']) {
            isRestricted = true;
          }

          // re-validate all data
          this.errorService.viewModel = this.viewModel;
          this.errorService.validateAll().subscribe(
            (event) => {},
            (error) => {},
            () => {
              let errorFlag = FALFormErrorService.hasErrors(this.errorService.errors);
              if (program._links['program:submit'] && errorFlag === true) {
                this.redirectionUrl(id, 'review');
              }
            }
          );
          break;
        case 'reject':
          if (program && program._links && !program._links['program:request:reject']) {
            isRestricted = true;
          }
          break;
        case 'publish':
          if (program && program._links && !program._links['program:request:approve']) {
            isRestricted = true;
          }
          break;
        case 'addoredit':
          let url;
          if (this.router.url.indexOf('/add') >= 0) {
            if (this._falLinks && this._falLinks._links && !this._falLinks._links['program:create']) {
              isRestricted = true;
            } else if (!this.viewModel.title) {
              url = '/fal/add'.concat('#header-information');
              this.router.navigateByUrl(url);
            }
          } else {
            if (program && program._links && !program._links['program:update']) {
              isRestricted = true;
            } else if (!this.viewModel.title) {
              url = '/fal/' + this.viewModel.programId + '/edit'.concat('#header-information');
              this.router.navigateByUrl(url);
            }
          }
          break;
        case 'addoreditrao':
          if (this._falLinks && this._falLinks._links && !this._falLinks._links['program:regional:offices:create']) {
            isRestricted = true;
          }
          break;
        case 'review':
          if (program && program._links && !program._links['program:access']) {
            isRestricted = true;
          }
          break;
        case 'feeds':
          if (this._falLinks && !this._falLinks._links) {
            isRestricted = true;
          }
          break;
        case 'regAssLoc':
          if (this._falLinks && this._falLinks._links && !this._falLinks._links['program:regional:offices:create']) {
            isRestricted = true;
          }
          break;
      }
    if (isRestricted) {
      this.router.navigate(this.restrictedUrl);
    }

    return !isRestricted;
  }

  redirectionUrl(id: string, screen: string) {
    let url = '/fal/' + id + '/' + screen;
    this.router.navigateByUrl(url);
  }
}

