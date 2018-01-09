import { Injectable } from '@angular/core';
import * as Cookies from 'js-cookie';
import { Observable } from "rxjs";
import { DictionaryService } from "../../../../../../api-kit/dictionary/dictionary.service";
import { OpportunityService } from "../../../../../../api-kit/opportunity/opportunity.service";

@Injectable()

export class OpportunityFormService {
  authCookie: any;

  constructor(private oppService: OpportunityService, private dictionaryService: DictionaryService) {
    this.authCookie = Cookies.get('iPlanetDirectoryPro');
  }

  getPermissions(): Observable<any> {
    return this.oppService.getPermissions(this.authCookie);
  }

  getOpportunity(opportunityId: string, latest?: any): Observable<any> {
    return this.oppService.getContractOpportunityById(opportunityId, this.authCookie, latest);
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

  searchRelatedOpportunities(keyword: string, type: string, size: number) {
    return this.oppService.searchRelatedOpportunities(keyword, type, size, this.authCookie)
  }
}
