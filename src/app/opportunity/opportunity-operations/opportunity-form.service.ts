import { Injectable } from '@angular/core';
import { OpportunityService } from "../../../api-kit/opportunity/opportunity.service";
import * as Cookies from 'js-cookie';
import { DictionaryService } from "../../../api-kit/dictionary/dictionary.service";


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

  getOpportunity(opportunityId: string) {
    return this.oppService.getOpportunityById(opportunityId);
  }
}
