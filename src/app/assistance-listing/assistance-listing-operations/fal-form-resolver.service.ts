import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {FALFormService} from "./fal-form.service";
import {FALFormViewModel} from "./fal-form.model";
import {Observable} from "rxjs";

@Injectable()
export class FALFormResolver implements Resolve<FALFormViewModel> {
  constructor(private service: FALFormService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FALFormViewModel> {
    let id = route.params['id'];
    return this.service.getFAL(id);
  }
}
