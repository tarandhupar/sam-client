import {Injectable} from '@angular/core';
import {OpportunityService} from "../../../../../../api-kit/opportunity/opportunity.service";
import * as Cookies from 'js-cookie';
import {DictionaryService} from "../../../../../../api-kit/dictionary/dictionary.service";
import {Observable} from "rxjs";
@Injectable()

export class OpportunityFormService {
  authCookie: any;

  constructor(private oppService: OpportunityService, private dictionaryService: DictionaryService) {
    this.authCookie = Cookies.get('iPlanetDirectoryPro');
  }

  getPermissions(): Observable<any> {
    return this.oppService.getPermissions(this.authCookie);
  }

  getOpportunity(opportunityId: string): Observable<any> {
    return this.oppService.getContractOpportunityById(opportunityId, this.authCookie);
  }

  saveContractOpportunity(opportunityId: string, data: {}): Observable<any> {
    return this.oppService.saveContractOpportunity(opportunityId, data, this.authCookie);
  }

  deleteContractOpportunity(opportunityId: string): Observable<any> {
    return this.oppService.deleteContractOpportunity(opportunityId, this.authCookie);
  }

  getOpportunityDictionary(type){
    return this.dictionaryService.getContractOpportunityDictionary(type);
  }
}
