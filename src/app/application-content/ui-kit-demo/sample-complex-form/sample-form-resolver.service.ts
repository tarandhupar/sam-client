import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {SampleFormService} from "./sample-form.service";
import {SampleFormViewModel} from "./sample-form.model";
import {Observable} from "rxjs";

@Injectable()
export class SampleFormResolver implements Resolve<SampleFormViewModel> {
  constructor(private service: SampleFormService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SampleFormViewModel> {
    let id = route.params['id'];
    return Observable.of({});//api kit observable here
  }
}
