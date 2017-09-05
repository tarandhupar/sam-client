import { BaseRequestOptions, ResponseOptions, Http, Response } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend} from '@angular/http/testing';
import { WrapperService} from "../../../api-kit/wrapper/wrapper.service";
import { OpportunityService } from "../../../api-kit/opportunity/opportunity.service";
import * as Cookies from 'js-cookie';
import { DictionaryService } from "../../../api-kit/dictionary/dictionary.service";
import { Router, RouterModule } from "@angular/router";
import { OpportunityFormService } from "./opportunity-form.service";

describe('src/app/opportunity/opportunity-operations/opportunity-form.service.ts', () => {
  let formService: OpportunityFormService;
  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        WrapperService,
        OpportunityService,
        OpportunityFormService,
        DictionaryService,
        BaseRequestOptions,
        MockBackend,
        {provide: Router, useClass: RouterModule},
        {
          provide: Http,
        },
      ],
    });
  });

  it('OpportunityFormService.getOpportunity: should HaveBeenCalledWith to opportunityService.getOpportunityById', inject([WrapperService, OpportunityService, OpportunityFormService, DictionaryService], (testService: OpportunityFormService, wrapperService: WrapperService, oppService: OpportunityService, dictionaryService: DictionaryService) => {
    oppService = new OpportunityService(wrapperService);
    let spyData = spyOn(oppService, 'getOpportunityById');
    formService = new OpportunityFormService(oppService, dictionaryService);
    let id = '5e859411e7f47a2e6e53d280b323236d';
    formService.getOpportunity(id);
    expect(spyData).toHaveBeenCalledWith(id);
  }));

});
