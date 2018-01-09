import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from "rxjs";
import {CBAFormViewModel} from "./framework/data-model/form/cba-form.model";
import {WageDeterminationService} from "../../../api-kit";

@Injectable()
export class CBAFormResolver implements Resolve<CBAFormViewModel> {
  constructor(private service: WageDeterminationService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CBAFormViewModel> {
    let id = route.params['id'];
    return this.service.getWageDeterminationById(id);
  }
}


