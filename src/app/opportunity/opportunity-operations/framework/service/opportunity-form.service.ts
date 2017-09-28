import { Injectable } from '@angular/core';
import { OpportunityService } from "../../../../../api-kit/opportunity/opportunity.service";
import * as Cookies from 'js-cookie';
import { DictionaryService } from "../../../../../api-kit/dictionary/dictionary.service";


@Injectable()

export class OpportunityFormService {

  cookie: any;

  constructor(private oppService: OpportunityService, private dictionaryService: DictionaryService) {
    this.cookie = Cookies.get('iPlanetDirectoryPro');
  }

  //  TODO: Moved to generic authentication service
  static getAuthenticationCookie() {
    return Cookies.get('iPlanetDirectoryPro');
  }

  isOpportunityEnabled(){
    return this.oppService.isOpportunityEnabled(OpportunityFormService.getAuthenticationCookie());
  }

  getOpportunity(opportunityId: string) {
    return this.oppService.getContractOpportunityById(opportunityId);
  }

  saveContractOpportunity(opportunityId: string, data: {}){
    return this.oppService.saveContractOpportunity(opportunityId, data);
  }

  deleteContractOpportunity(opportunityId: string){
    return this.oppService.deleteContractOpportunity(opportunityId);
  }
}
