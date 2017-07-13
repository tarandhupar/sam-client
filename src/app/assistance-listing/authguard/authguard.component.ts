import * as Cookies from 'js-cookie';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Injectable, Input} from '@angular/core';
import {FALFormErrorService} from "../assistance-listing-operations/fal-form-error.service";
import {FALFormViewModel} from "../assistance-listing-operations/fal-form.model";
import {FALFormService} from "../assistance-listing-operations/fal-form.service";

@Injectable()
export class AuthGuard implements CanActivate {
  @Input() viewModel: FALFormViewModel;
  location: any;

  constructor(private router: Router, private errorService: FALFormErrorService, private service: FALFormService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (Cookies.get('iPlanetDirectoryPro') === undefined) {
      this.router.navigate(['signin']);
    } else if (Cookies.get('iPlanetDirectoryPro') !== undefined && SHOW_HIDE_RESTRICTED_PAGES === 'false') {
      this.router.navigate(['accessrestricted']);
    }
    return true;
  }

  checkPermissions(screen: string, program: any) {
    this.viewModel = new FALFormViewModel(program);
    this.errorService = new FALFormErrorService();
    this.errorService.viewModel = this.viewModel;
    this.errorService.initFALErrors();
    let errorFlag = FALFormErrorService.hasErrors(this.errorService.errors);

    if (Cookies.get('iPlanetDirectoryPro') !== undefined && SHOW_HIDE_RESTRICTED_PAGES === 'true') {
      let pathArray = this.router.url.split("/");
      let id = pathArray[2];
      switch (screen) {
        case 'submit':
          if (program && program._links && !program._links['program:submit']) {
            this.router.navigate(['accessrestricted']);
          } else if (program._links['program:submit'] && errorFlag === true) {
            this.redirectionUrl(id, 'review');
          }
          break;
        case 'reject':
          if (program && program._links && !program._links['program:request:reject']) {
            this.router.navigate(['accessrestricted']);
          }
          break;
        case 'publish':
          if (program && program._links && !program._links['program:request:approve']) {
            this.router.navigate(['accessrestricted']);
          }
          break;
        case 'addoredit':
          if (this.router.url.indexOf('add') >= 0) {
            if (program && !program['CREATE_FALS']) {
              this.router.navigate(['accessrestricted']);
            }
          } else {
            if (program && program._links && !program._links['program:update']) {
              this.router.navigate(['accessrestricted']);
            }
          }
          break;
        case 'addoreditrao':
          if (program && !program['CREATE_RAO']) {
          this.router.navigate(['accessrestricted']);
        }

          break;
      }
    }
  }

  redirectionUrl(id: string, screen: string) {
    let url = '/programs/' + id + '/' + screen;
    this.router.navigateByUrl(url);
  }
}

