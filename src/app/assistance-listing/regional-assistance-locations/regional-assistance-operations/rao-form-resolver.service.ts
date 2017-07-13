import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {FALFormService} from "./fal-form.service";
import {FALFormViewModel} from "./fal-form.model";
import {Observable} from "rxjs";
import {RAOFormViewModel} from "./regional-assistance-form.model";
import {RAOFormService} from "./regional-assistance-form.service";

@Injectable()
export class RAOFormResolver implements Resolve<RAOFormViewModel> {
  constructor(private service: RAOFormService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RAOFormViewModel> {
    let id = route.params['id'];
    return this.service.getRAO(id);
  }
}
