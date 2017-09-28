import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { OpportunityFormService } from "./framework/service/opportunity-form.service";
import { OpportunityFormViewModel } from "./framework/data-model/opportunity-form.model";
import { Observable } from "rxjs";

@Injectable()
export class OpportunityFormResolver implements Resolve<OpportunityFormViewModel> {
  constructor(private service: OpportunityFormService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OpportunityFormViewModel> {
    let id = route.params['id'];
    return this.service.getOpportunity(id);
  }
}


